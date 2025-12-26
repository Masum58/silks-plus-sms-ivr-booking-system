const axios = require('axios');
const config = require('../config/config');

class TaxiCallerService {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.TAXICALLER_API_URL || 'https://api.taxicaller.net',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        this.apiKey = process.env.TAXICALLER_API_KEY;
        this.companyId = process.env.TAXICALLER_COMPANY_ID;
    }

    /**
     * Get Authorization Header
     * TaxiCaller uses Bearer token or API Key. Assuming API Key for now or JWT.
     * If JWT is needed, we need an auth method.
     * Based on docs: "Authentication is handled by provided JsonWebToken Example: Bearer xxx.yyy.zzz"
     * We might need a way to generate this token or use a static one if provided.
     * For now, we'll assume the API_KEY is the token or we use it to get one.
     */
    getAuthHeader() {
        // Placeholder: Assuming the API Key is the Bearer token for simplicity
        // If real auth flow is needed (login to get token), we will implement that.
        return `Bearer ${this.apiKey}`;
    }

    /**
     * Create a new client (customer)
     * @param {Object} customerData - { name, phone, email }
     * @returns {Promise<Object>} Created client data
     */
    async createClient(customerData) {
        try {
            console.log('Creating TaxiCaller client:', customerData);

            // Endpoint: POST /api/v1/company/{company_id}/client
            const response = await this.client.post(
                `/api/v1/company/${this.companyId}/client`,
                {
                    client: {
                        first_name: customerData.firstName || customerData.name.split(' ')[0],
                        last_name: customerData.lastName || customerData.name.split(' ').slice(1).join(' ') || '.',
                        phone: customerData.phone,
                        email: customerData.email || `${customerData.phone.replace('+', '')}@example.com`,
                        country: 'US' // Defaulting to US for now
                    },
                    client_password: 'DefaultPassword123!' // Required by API?
                },
                {
                    headers: { 'Authorization': this.getAuthHeader() }
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
     * @param {Object} bookingData 
     * @returns {Promise<Object>} Created booking data
     */
    async createBooking(bookingData) {
        try {
            console.log('Creating TaxiCaller booking:', bookingData);

            // Endpoint: POST /api/v1/booker (or similar dispatch endpoint)
            // We need to map our bookingData to TaxiCaller's expected format

            // Map Gender Preference to Attributes
            // Assuming TaxiCaller uses "attributes" array for requirements
            // We need to know the exact attribute IDs or names from TaxiCaller config
            // For now, we will use string names "FEMALE_DRIVER" / "MALE_DRIVER"
            const attributes = [];
            if (bookingData.driverGender && bookingData.driverGender.toLowerCase() === 'female') {
                attributes.push('FEMALE_DRIVER');
            } else if (bookingData.driverGender && bookingData.driverGender.toLowerCase() === 'male') {
                attributes.push('MALE_DRIVER');
            }

            const payload = {
                order: {
                    company_id: parseInt(this.companyId),
                    provider_id: 0,
                    items: {
                        "@type": "passengers",
                        seq: 1,
                        passenger: {
                            name: bookingData.customerName,
                            phone: bookingData.customerPhone,
                            client_id: bookingData.clientId || 0 // 0 if no account
                        }
                    },
                    route: {
                        nodes: [
                            {
                                location: {
                                    name: bookingData.pickupAddress,
                                    // coords: [long, lat] - Need to ensure we have these
                                }
                            },
                            {
                                location: {
                                    name: bookingData.dropoffAddress,
                                    // coords: [long, lat]
                                }
                            }
                        ]
                    },
                    // Add attributes if any
                    ...(attributes.length > 0 && { attributes: attributes })
                }
            };

            // Add coordinates if available
            if (bookingData.pickupCoordinates) {
                payload.order.route.nodes[0].location.coords = bookingData.pickupCoordinates;
            }
            if (bookingData.dropoffCoordinates) {
                payload.order.route.nodes[1].location.coords = bookingData.dropoffCoordinates;
            }

            const response = await this.client.post('/api/v1/booker', payload, {
                headers: { 'Authorization': this.getAuthHeader() }
            });

            console.log('TaxiCaller Booking Created:', response.data);
            return response.data;

        } catch (error) {
            console.error('Error creating TaxiCaller booking:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new TaxiCallerService();
