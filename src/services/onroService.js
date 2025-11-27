const axios = require('axios');
const config = require('../config/config');

class OnroService {
    constructor() {
        this.client = axios.create({
            baseURL: config.onro.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Placeholder for auth token management if needed
        this.token = null;
    }

    async authenticate() {
        // Implement authentication logic here if Onro requires a separate auth step
        // For now, we'll assume basic auth or header-based auth as per typical integrations
        // If Onro uses OAuth or similar, we would implement the token fetch here
        console.log('Authenticating with Onro...');
        // Example:
        // const response = await this.client.post('/auth/login', { ...credentials });
        // this.token = response.data.token;
        return true;
    }

    async getBooking(bookingId) {
        try {
            // Adjust endpoint as per Onro API docs
            const response = await this.client.get(`/bookings/${bookingId}`, {
                params: {
                    customer_id: config.onro.customerId,
                    // Add auth headers if needed
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
            const response = await this.client.post('/bookings', bookingData, {
                params: {
                    customer_id: config.onro.customerId,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = new OnroService();
