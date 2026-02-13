const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class TaxiCallerService {
    constructor() {
        // Main API Client (for Booking/Dispatch)
        this.client = axios.create({
            baseURL: config.taxiCaller.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        // Auth Client (for generating JWT)
        // Note: JWT generation usually happens on the same API domain for RC
        this.authClient = axios.create({
            baseURL: config.taxiCaller.apiUrl,
            timeout: 15000
        });

        this.apiToken = config.taxiCaller.apiKey;
        this.companyId = config.taxiCaller.companyId;

        // Token Cache
        this.jwtToken = null;
        this.tokenExpiration = 0;
    }

    /**
     * Helper to format TaxiCaller price (milli-units to USD)
     * Enforces $6.00 minimum
     */
    formatPrice(rawPrice) {
        if (!rawPrice || rawPrice === "Not Available") {
            return "$6.00";
        }

        // If it's already formatted (starts with $), just return it
        if (typeof rawPrice === 'string' && rawPrice.startsWith('$')) {
            return rawPrice;
        }

        // Handle numerical milli-units (like 8000 for $8.00)
        let amount = 0;
        if (typeof rawPrice === 'number') {
            amount = rawPrice / 1000;
        } else {
            // Extract numbers from string
            const digits = String(rawPrice).replace(/\D/g, '');
            if (digits) {
                amount = parseInt(digits) / 1000;
            }
        }

        if (amount > 0) {
            if (amount < 6) amount = 6.00;
            return `$${amount.toFixed(2)}`;
        }

        return "$6.00";
    }

    /**
     * Get Valid JWT Access Token
     * Checks cache or fetches new token from TaxiCaller
     */
    async getAccessToken() {
        // Buffer time: Refresh if expiring in less than 60 seconds
        if (this.jwtToken && Date.now() < this.tokenExpiration - 60000) {
            return this.jwtToken;
        }

        console.log('🔄 Refreshing TaxiCaller JWT Token...');

        try {
            if (!this.apiToken) {
                throw new Error('TAXICALLER_API_KEY (API Token) is missing in .env');
            }

            // Endpoint: /AdminService/v1/jwt/for-key
            // Query Params: key, sub, ttl
            const response = await this.authClient.get('/AdminService/v1/jwt/for-key', {
                params: {
                    key: this.apiToken,
                    sub: '*', // Required for the new production API key
                    ttl: 900  // 15 minutes (max allowed)
                }
            });

            // The response body IS the token string (based on typical text/plain responses)
            // Or it might be JSON. Let's handle both.
            let token = response.data;
            if (typeof token === 'object' && token.token) {
                token = token.token;
            }

            if (!token) {
                throw new Error('Failed to retrieve token from response');
            }

            this.jwtToken = token;
            this.tokenExpiration = Date.now() + (900 * 1000); // 15 minutes from now

            console.log('✅ New TaxiCaller JWT Token acquired');
            return this.jwtToken;

        } catch (error) {
            console.error('❌ Failed to get TaxiCaller JWT:', error.message);
            throw error;
        }
    }

    /**
     * Get Authorization Header
     */
    async getAuthHeader() {
        const token = await this.getAccessToken();
        return `Bearer ${token}`;
    }

    /**
     * Create a new client (customer)
     */
    async createClient(customerData) {
        try {
            console.log('Creating TaxiCaller client:', customerData);
            const authHeader = await this.getAuthHeader();

            const response = await this.client.post(
                `/api/v1/company/${this.companyId}/client`,
                {
                    client: {
                        first_name: customerData.firstName || customerData.name.split(' ')[0],
                        last_name: customerData.lastName || customerData.name.split(' ').slice(1).join(' ') || '.',
                        phone: customerData.phone,
                        email: customerData.email || `${customerData.phone.replace('+', '')}@example.com`,
                        country: 'US'
                    },
                    client_password: 'DefaultPassword123!'
                },
                {
                    headers: { 'Authorization': authHeader }
                }
            );

            console.log('TaxiCaller Client Created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating TaxiCaller client:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Create a booking
     */
    /**
     * Get Booker Token (Required for Booking API)
     */
    async getBookerToken() {
        try {
            const authHeader = await this.getAuthHeader();
            const creds = {
                creds: {
                    company_id: parseInt(this.companyId),
                    ops: 3
                }
            };

            const response = await this.client.get('/api/v1/booker/booker-token', {
                headers: { 'Authorization': authHeader },
                params: {
                    data: JSON.stringify(creds)
                }
            });

            let token = response.data.token || response.data.jwt || response.data;
            if (typeof token === 'object' && token.token) token = token.token;

            return token;
        } catch (error) {
            console.error('❌ Failed to get Booker Token:', error.message);
            throw error;
        }
    }

    /**
     * Create a booking
     */
    async createBooking(bookingData) {
        try {
            console.log('Creating TaxiCaller booking:', bookingData);

            // 1. Get Booker Token
            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            // Map Gender Preference
            const attributes = [];
            if (bookingData.driverGender && bookingData.driverGender.toLowerCase() === 'female') {
                attributes.push('FEMALE_DRIVER');
            } else if (bookingData.driverGender && bookingData.driverGender.toLowerCase() === 'male') {
                attributes.push('MALE_DRIVER');
            }

            // Helper to convert lat/lng to micro-degrees (TaxiCaller format)
            const toMicro = (coord) => (coord !== null && coord !== undefined) ? Math.round(coord * 1000000) : null;

            // Construct Route Nodes
            const nodes = [
                {
                    location: {
                        name: bookingData.pickupAddress,
                        ...(bookingData.pickupCoordinates && {
                            coords: [toMicro(bookingData.pickupCoordinates[0]), toMicro(bookingData.pickupCoordinates[1])]
                        })
                    },
                    actions: [{ "@type": "client_action", item_seq: 0, action: "in" }],
                    seq: 0,
                    times: {
                        arrive: {
                            target: 0, // ASAP booking
                            latest: 0
                        }
                    }
                }
            ];

            // Add Drop-off (Final Node)
            nodes.push({
                location: {
                    name: bookingData.dropoffAddress,
                    ...(bookingData.dropoffCoordinates && {
                        coords: [toMicro(bookingData.dropoffCoordinates[0]), toMicro(bookingData.dropoffCoordinates[1])]
                    })
                },
                actions: [{ "@type": "client_action", item_seq: 0, action: "out" }],
                seq: nodes.length
            });

            // Construct Payload based on TaxiCaller Support (Julianna's) Example
            const payload = {
                order: {
                    company_id: parseInt(this.companyId),
                    provider_id: 0, // CRITICAL: 0 is for the general unassigned pool
                    vehicle_type: bookingData.vehicleType || "1",
                    external_id: bookingData.externalId || null,
                    items: [
                        {
                            "@type": "passengers",
                            seq: 0,
                            passenger: {
                                name: bookingData.customerName,
                                phone: bookingData.customerPhone,
                                email: bookingData.customerEmail || "guest@example.com"
                            },
                            require: {
                                seats: parseInt(bookingData.passengers) || 1,
                                wc: 0,
                                bags: 0
                            },
                            pay_info: [{
                                "@t": 5, // CARD_PRESENT (Default for our system)
                                data: null
                            }]
                        }
                    ],
                    route: {
                        nodes: nodes
                    },
                    ...(attributes.length > 0 && { attributes: attributes }),
                    auto_assign: false, // Try inside order
                    booked_by: "Vapi AI Assistant"
                },
                dispatch_options: {
                    auto_assign: false // Standard top-level
                }
            };

            // 2. Create Booking via /api/v1/booker/order
            const logFile = path.join(__dirname, '../../logs/taxicaller.log');
            if (!fs.existsSync(path.dirname(logFile))) fs.mkdirSync(path.dirname(logFile));
            fs.appendFileSync(logFile, `\n--- ${new Date().toISOString()} CREATE ORDER PAYLOAD ---\n${JSON.stringify(payload, null, 2)}\n`);

            const response = await this.client.post('/api/v1/booker/order', payload, {
                headers: { 'Authorization': bookerAuthHeader }
            });

            fs.appendFileSync(logFile, `\n--- ${new Date().toISOString()} CREATE ORDER RESPONSE ---\n${JSON.stringify(response.data, null, 2)}\n`);
            console.log('TaxiCaller Booking Created Response:', JSON.stringify(response.data, null, 2));

            // Extract and format price
            const fareQuote = response.data.order?.fare_quote || response.data.fare_quote;
            let rawPrice = response.data.order?.price || response.data.price || null;

            if (fareQuote && fareQuote.total > 0) {
                rawPrice = `${fareQuote.total} ${fareQuote.currency || 'USD'}`;
            }

            const formattedPrice = this.formatPrice(rawPrice);

            return {
                ...response.data,
                price: formattedPrice,
                rawPrice: rawPrice // keep raw for internal logging if needed
            };

        } catch (error) {
            console.error('Error creating TaxiCaller booking:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get Fare Estimate and Availability
     * Endpoint: POST /api/v1/booker/availability/order
     */
    async getFareEstimate(bookingData) {
        try {
            console.log('🔍 Fetching TaxiCaller Fare Estimate (Availability API):', bookingData);

            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            // Helper to convert lat/lng to micro-degrees
            const toMicro = (coord) => (coord !== null && coord !== undefined) ? Math.round(coord * 1000000) : null;

            // Construct Payload (Similar to createBooking but for availability)
            const payload = {
                order: {
                    company_id: parseInt(this.companyId),
                    provider_id: 0, // 0 for any provider
                    vehicle_type: bookingData.vehicleType || "1",
                    items: [
                        {
                            "@type": "passengers",
                            seq: 0,
                            passenger: {
                                name: "Test User",
                                phone: "+1234567890",
                                email: "test@example.com"
                            },
                            require: {
                                seats: 1,
                                wc: 0,
                                bags: 0
                            },
                            pay_info: [{
                                "@t": 5, // CARD_PRESENT
                                data: null
                            }]
                        }
                    ],
                    route: {
                        nodes: [
                            {
                                location: {
                                    name: bookingData.pickupAddress,
                                    ...(bookingData.pickupCoordinates && {
                                        coords: [toMicro(bookingData.pickupCoordinates[0]), toMicro(bookingData.pickupCoordinates[1])]
                                    })
                                },
                                actions: [{ "@type": "client_action", item_seq: 0, action: "in" }],
                                seq: 0,
                                times: { arrive: { target: 0, latest: 0 } }
                            },
                            {
                                location: {
                                    name: bookingData.dropoffAddress,
                                    ...(bookingData.dropoffCoordinates && {
                                        coords: [toMicro(bookingData.dropoffCoordinates[0]), toMicro(bookingData.dropoffCoordinates[1])]
                                    })
                                },
                                actions: [{ "@type": "client_action", item_seq: 0, action: "out" }],
                                seq: 1
                            }
                        ]
                    }
                }
            };

            const response = await this.client.post('/api/v1/booker/availability/order', payload, {
                headers: { 'Authorization': bookerAuthHeader }
            });

            console.log('✅ Fare Estimate Response:', JSON.stringify(response.data, null, 2));

            // Extract price from first slot
            const rawPrice = response.data.slots?.[0]?.fare_quote?.amount;
            const formattedPrice = this.formatPrice(rawPrice);

            return {
                ...response.data,
                price: formattedPrice,
                rawPrice: rawPrice
            };
        } catch (error) {
            console.error('❌ Error fetching fare estimate:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Cancel an order
     */
    async cancelOrder(orderId) {
        try {
            console.log(`🚫 Cancelling TaxiCaller order: ${orderId}`);
            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            // Confirmed working endpoint for RC Booker API
            const response = await this.client.post(
                `/api/v1/booker/order/${orderId}/cancel`,
                {},
                {
                    headers: { 'Authorization': bookerAuthHeader }
                }
            );

            console.log('✅ TaxiCaller Order Cancelled:', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            console.error('❌ Error cancelling TaxiCaller order:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get order status/details
     */
    async getOrderStatus(orderId) {
        try {
            console.log(`🔍 Fetching details for TaxiCaller order: ${orderId}`);
            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            const response = await this.client.get(
                `/api/v1/booker/order/${orderId}`,
                {
                    headers: { 'Authorization': bookerAuthHeader }
                }
            );

            return response.data;
        } catch (error) {
            console.error('❌ Error fetching TaxiCaller order status:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get active orders for a customer (by phone)
     */
    async getActiveOrders(phone) {
        try {
            console.log(`🔍 Fetching active orders for phone: ${phone}`);
            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            // Typical Booker API pattern for listing orders
            const response = await this.client.get(
                `/api/v1/booker/order`,
                {
                    headers: { 'Authorization': bookerAuthHeader },
                    params: {
                        company_id: this.companyId
                    }
                }
            );

            const list = response.data.list || response.data || [];
            // Filter by phone if the API returns all orders for the booker (which might be the case for generic key)
            const active = list.filter(o => {
                const orderPhone = o.order?.items?.[0]?.passenger?.phone || o.customer_phone;
                return orderPhone === phone && (o.state?.state !== 'cancelled' && o.state?.state !== 'completed');
            });

            console.log(`✅ Active orders for ${phone} found:`, active.length);
            return active;
        } catch (error) {
            console.log('⚠️ Active Orders fetch failed (might not be supported by this token):', error.message);
            return []; // Return empty instead of throwing to avoid breaking the caller
        }
    }
}

module.exports = new TaxiCallerService();
