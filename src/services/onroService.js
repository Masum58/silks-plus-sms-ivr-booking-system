const axios = require('axios');
const config = require('../config/config');

class OnroService {
    constructor() {
        this.client = axios.create({
            baseURL: config.onro.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': 'en' // Added based on screenshot
            },
        });

        this.token = null;
        this.tokenExpiry = null;
        this.customerId = null; // Store customerId from auth response
    }

    async authenticate() {
        try {
            console.log('Authenticating with Onro...');
            // Endpoint from screenshot: /api/v1/customer/auth/access-token
            const response = await this.client.post('/api/v1/customer/auth/access-token', {
                clientId: config.onro.clientId,
                clientSecret: config.onro.clientSecret
            });

            // Response structure from screenshot:
            // { "data": { "accessToken": "...", "customerId": "...", "expiresIn": 3600 } }
            if (response.data && response.data.data && response.data.data.accessToken) {
                this.token = response.data.data.accessToken;
                this.customerId = response.data.data.customerId; // Capture customerId

                const expiresIn = response.data.data.expiresIn || 3600;
                this.tokenExpiry = Date.now() + (expiresIn * 1000);

                console.log('Onro Authentication successful');
                return true;
            } else {
                throw new Error('Invalid response structure from Onro Auth');
            }
        } catch (error) {
            console.error('Onro Authentication failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async getValidToken() {
        if (!this.token || Date.now() >= this.tokenExpiry) {
            await this.authenticate();
        }
        return this.token;
    }

    async getBooking(bookingId) {
        try {
            const token = await this.getValidToken();
            // Guessing endpoint based on Auth pattern: /api/v1/customer/orders/{id}
            const response = await this.client.get(`/api/v1/customer/orders/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching booking:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async createBooking(bookingData) {
        try {
            const token = await this.getValidToken();

            // Ensure customerId is present
            if (!bookingData.customerId && this.customerId) {
                bookingData.customerId = this.customerId;
            }

            console.log('Creating order with data:', JSON.stringify(bookingData, null, 2));

            // Use On-Demand Endpoint directly
            const response = await this.client.post('/api/v1/customer/order/ondemand', bookingData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = new OnroService();
