const taxiCallerService = require('./taxiCallerService');

class CustomerService {
    constructor() {
        // In-memory customer cache (phone → client ID)
        this.customerCache = new Map();
    }

    /**
     * Get or create customer
     * Uses TaxiCaller to create a client account
     */
    async getOrCreateCustomer(customerData) {
        const { phone, name, email } = customerData;

        console.log(`\n🔍 Looking up customer: ${phone}`);

        // Check cache first
        if (this.customerCache.has(phone)) {
            console.log(`📋 Customer found in cache: ${phone}`);
            return this.customerCache.get(phone);
        }

        try {
            // In TaxiCaller, we can try to create the client.
            // If it exists, we might get an error or the existing client.
            // For this migration, we will try to create.

            console.log(`   Creating/Retrieving TaxiCaller client...`);
            const client = await taxiCallerService.createClient({
                name: name || 'Customer',
                phone: phone,
                email: email
            });

            // Assuming response contains the client ID
            // Adjust based on actual TaxiCaller response structure
            const clientId = client.id || client.client_id;

            if (clientId) {
                this.customerCache.set(phone, clientId);
                console.log(`✅ Customer ready: ${phone} → ${clientId}`);
                return clientId;
            } else {
                throw new Error('No client ID returned from TaxiCaller');
            }

        } catch (error) {
            console.error('Error in getOrCreateCustomer:', error.message);
            // If creation fails (e.g. already exists), we might need a fallback or search strategy.
            // For now, rethrow or return null.
            throw error;
        }
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

