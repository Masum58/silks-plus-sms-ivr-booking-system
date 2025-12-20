/**
 * Order Reference Service
 * Generates short 6-digit reference codes and maps them to Onro Order IDs
 */

class OrderReferenceService {
    constructor() {
        // In-memory storage (will be replaced with MongoDB later)
        this.orderMap = new Map();
    }

    /**
     * Generate a 5-character alphanumeric reference code (e.g., 9zxy2)
     * @returns {string} 5-char alphanumeric code
     */
    generateReference() {
        // Generate random 5-char alphanumeric string
        // toString(36) converts to base36 (0-9, a-z)
        // slice(2, 7) takes 5 characters after "0."
        let reference = Math.random().toString(36).substring(2, 7);

        // Ensure uniqueness
        while (this.orderMap.has(reference)) {
            reference = Math.random().toString(36).substring(2, 7);
        }

        return reference;
    }

    /**
     * Store order reference mapping
     * @param {string} reference - Short reference code
     * @param {string} orderId - Full Onro Order ID
     * @param {object} orderData - Additional order data
     */
    storeOrder(reference, orderId, orderData = {}) {
        this.orderMap.set(reference, {
            orderId: orderId,
            createdAt: new Date(),
            ...orderData
        });

        console.log(`📝 Stored mapping: ${reference} → ${orderId}`);
    }

    /**
     * Get full Order ID from reference
     * @param {string} reference - Short reference code
     * @returns {string|null} Full Onro Order ID or null if not found
     */
    getOrderId(reference) {
        const order = this.orderMap.get(reference);
        return order ? order.orderId : null;
    }

    /**
     * Get order data from reference
     * @param {string} reference - Short reference code
     * @returns {object|null} Order data or null if not found
     */
    getOrder(reference) {
        return this.orderMap.get(reference) || null;
    }

    /**
     * Check if reference exists
     * @param {string} reference - Short reference code
     * @returns {boolean}
     */
    hasReference(reference) {
        return this.orderMap.has(reference);
    }

    /**
     * Get all orders (for debugging)
     * @returns {Array}
     */
    getAllOrders() {
        return Array.from(this.orderMap.entries()).map(([ref, data]) => ({
            reference: ref,
            ...data
        }));
    }

    /**
     * Get orders by customer phone number
     * @param {string} phone - Customer phone number
     * @returns {Array} List of orders
     */
    getOrdersByPhone(phone) {
        const orders = [];
        // Remove non-digits
        const searchPhone = phone.replace(/\D/g, '');

        if (searchPhone.length < 4) return []; // Too short

        for (const [reference, data] of this.orderMap.entries()) {
            const storedPhone = (data.customerPhone || '').replace(/\D/g, '');

            // Check if numbers match (handle country codes by checking end)
            if (storedPhone && (storedPhone.endsWith(searchPhone) || searchPhone.endsWith(storedPhone))) {
                orders.push({
                    reference,
                    ...data
                });
            }
        }
        return orders;
    }
}

// Export singleton instance
module.exports = new OrderReferenceService();
