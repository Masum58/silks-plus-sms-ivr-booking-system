const axios = require('axios');
const config = require('../config/config');

class TaxiCallerService {
    constructor() {
        // Main API Client (for Booking/Dispatch)
        this.client = axios.create({
            baseURL: process.env.TAXICALLER_API_URL || 'https://api-rc.taxicaller.net',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        // Auth Client (for generating JWT)
        // Note: JWT generation usually happens on the main API domain, even for RC
        this.authClient = axios.create({
            baseURL: process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net',
            timeout: 15000
        });

        this.apiToken = process.env.TAXICALLER_API_KEY; // The long-lived API Token
        this.companyId = process.env.TAXICALLER_COMPANY_ID;

        // Token Cache
        this.jwtToken = null;
        this.tokenExpiration = 0;
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
                    sub: 'ivr', // Subject (as per client example)
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

            // Construct Route Nodes
            const nodes = [
                {
                    location: {
                        name: bookingData.pickupAddress,
                        ...(bookingData.pickupCoordinates && { coords: bookingData.pickupCoordinates })
                    },
                    actions: [{ "@type": "client_action", item_seq: 0, action: "in" }],
                    seq: 0,
                    times: {
                        arrive: {
                            // Pre-booking (15 minutes in the future) to bypass "No online vehicle" error
                            target: Math.floor(Date.now() / 1000) + 900,
                            latest: 0
                        }
                    }
                }
            ];

            // Add Additional Stops (if any)
            if (bookingData.additionalStops && Array.isArray(bookingData.additionalStops)) {
                bookingData.additionalStops.forEach((stop, index) => {
                    nodes.push({
                        location: {
                            name: stop.address,
                            ...(stop.coordinates && { coords: stop.coordinates })
                        },
                        seq: index + 1
                    });
                });
            }

            // Add Drop-off (Final Node)
            nodes.push({
                location: {
                    name: bookingData.dropoffAddress,
                    ...(bookingData.dropoffCoordinates && { coords: bookingData.dropoffCoordinates })
                },
                actions: [{ "@type": "client_action", item_seq: 0, action: "out" }],
                seq: nodes.length
            });

            // Construct Payload
            const payload = {
                order: {
                    company_id: parseInt(this.companyId),
                    provider_id: 0,
                    items: [
                        {
                            "@type": "passengers",
                            seq: 0,
                            vehicle_type_id: parseInt(bookingData.vehicleType) || 2,
                            passenger: {
                                name: bookingData.customerName,
                                phone: bookingData.customerPhone,
                                email: bookingData.customerEmail || "guest@example.com"
                            },
                            client_id: 0, // Guest Booking
                            require: {
                                seats: 1,
                                wc: 0,
                                bags: 0
                            },
                            pay_info: [
                                {
                                    "@t": 0, // CASH
                                    "data": null
                                }
                            ]
                        }
                    ],
                    route: {
                        nodes: nodes
                    },
                    ...(attributes.length > 0 && { attributes: attributes })
                }
            };

            // 2. Create Booking via /api/v1/booker/order
            const response = await this.client.post('/api/v1/booker/order', payload, {
                headers: { 'Authorization': bookerAuthHeader }
            });

            console.log('TaxiCaller Booking Created:', JSON.stringify(response.data, null, 2));

            // Extract price if available in response
            let price = null;
            const fareQuote = response.data.order?.fare_quote || response.data.fare_quote;
            if (fareQuote && fareQuote.total > 0) {
                price = `${fareQuote.total} ${fareQuote.currency || 'USD'}`;
            } else {
                price = response.data.order?.price || response.data.price || null;
            }

            return {
                ...response.data,
                price: price
            };

        } catch (error) {
            console.error('Error creating TaxiCaller booking:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Cancel an existing booking
     */
    async cancelOrder(orderId) {
        try {
            console.log(`🚫 Cancelling TaxiCaller booking: ${orderId}`);
            const bookerToken = await this.getBookerToken();
            const bookerAuthHeader = `Bearer ${bookerToken}`;

            const url = `/api/v1/booker/order/${orderId}`;
            console.log(`   DELETE URL: ${url}`);

            const response = await this.client.delete(url, {
                headers: { 'Authorization': bookerAuthHeader }
            });

            console.log('TaxiCaller Booking Cancelled:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error cancelling TaxiCaller booking:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new TaxiCallerService();
