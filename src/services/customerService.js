const axios = require('axios');
const config = require('../config/config');

class CustomerService {
    constructor() {
        this.client = axios.create({
            baseURL: config.onro.apiUrl,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // In-memory customer cache (phone → customer ID)
        // TODO: Replace with MongoDB for persistence
        this.customerCache = new Map();
    }

    /**
     * Get access token from Onro API
     */
    async getAccessToken() {
        try {
            const response = await this.client.post('/api/v1/customer/auth/login', {
                clientId: config.onro.clientId,
                clientSecret: config.onro.clientSecret
            });
            return response.data.data.accessToken;
        } catch (error) {
            console.error('Error getting access token:', error.message);
            throw error;
        }
    }

    /**
     * Search for customer by phone number
     * Returns customer ID if found, null if not found
     */
    async findCustomerByPhone(phone) {
        // Check cache first
        if (this.customerCache.has(phone)) {
            console.log(`📋 Customer found in cache: ${phone}`);
            return this.customerCache.get(phone);
        }

        try {
            const token = await this.getAccessToken();

            // Try to get customer list and search by phone
            // Note: Onro API might have a search endpoint - adjust if available
            const response = await this.client.get('/api/v1/customer/customers', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { phone: phone }
            });

            if (response.data && response.data.data && response.data.data.length > 0) {
                const customerId = response.data.data[0].id;
                // Cache the result
                this.customerCache.set(phone, customerId);
                console.log(`✅ Customer found: ${phone} → ${customerId}`);
                return customerId;
            }

            console.log(`❌ Customer not found: ${phone}`);
            return null;
        } catch (error) {
            console.error('Error searching for customer:', error.message);
            // If search fails, assume customer doesn't exist
            return null;
        }
    }

    /**
     * Create new customer account
     * Returns customer ID
     */
    async createCustomer(customerData) {
        const { phone, name, email } = customerData;

        try {
            const token = await this.getAccessToken();

            console.log(`🆕 Creating new customer: ${phone}`);

            const payload = {
                phone: phone,
                firstName: name || 'Customer',
                lastName: '',
                email: email || `${phone}@temp.com`, // Temporary email if not provided
                // Add other required fields based on Onro API
            };

            const response = await this.client.post('/api/v1/customer/customers', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const customerId = response.data.data.id;

            // Cache the new customer
            this.customerCache.set(phone, customerId);

            console.log(`✅ Customer created: ${phone} → ${customerId}`);
            return customerId;
        } catch (error) {
            console.error('Error creating customer:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    /**
     * Get or create customer
     * Main function to use - handles lookup and creation automatically
     */
    async getOrCreateCustomer(customerData) {
        const { phone, name, email } = customerData;

        console.log(`\n🔍 Looking up customer: ${phone}`);

        // Try to find existing customer
        let customerId = await this.findCustomerByPhone(phone);

        // If not found, create new customer
        if (!customerId) {
            console.log(`   Customer not found. Creating new account...`);
            customerId = await this.createCustomer({ phone, name, email });
        } else {
            console.log(`   Customer exists. Using ID: ${customerId}`);
        }

        return customerId;
    }

    /**
     * Clear customer cache (for testing)
     */
    clearCache() {
        this.customerCache.clear();
        console.log('🗑️ Customer cache cleared');
    }
}

module.exports = new CustomerService();
