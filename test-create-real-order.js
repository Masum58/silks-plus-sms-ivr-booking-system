const onroService = require('./src/services/onroService');

async function testCreateRealOrder() {
    try {
        console.log('🔄 Authenticating...');
        await onroService.authenticate();

        const customerId = process.env.ONRO_CUSTOMER_ID;
        const vehicleTypeId = process.env.ONRO_VEHICLE_TYPE_ID; // Ensure this is set in .env

        const payload = {
            customerId: customerId,
            service: {
                id: "0_17d3kbyR41-zdPFiUQV", // Bag-Box
                options: []
            },
            paymentMethod: "Wallet",
            paymentSide: "Sender",
            promoCode: "",
            isScheduled: false,
            pickup: {
                address: "3 Austra Parkway #103 Monroe NY 10950",
                fullName: "Test Customer",
                phone: "+18126668455",
                coordinates: [-74.161288, 41.332023],
                customerDescription: "Test order for active lookup",
                schedulePickupNow: false,
                scheduleDateAfter: 0,
                scheduleDateBefore: 0,
                email: ""
            },
            dropoffs: [
                {
                    address: "7 Van Buren Drive #304 Monroe NY 10950",
                    fullName: "Receiver",
                    phone: "+18126668455",
                    coordinates: [-74.1686768, 41.3386472],
                    scheduleDateAfter: 0,
                    scheduleDateBefore: 0,
                    email: ""
                }
            ],
            vehicleType: {
                id: vehicleTypeId || "0CRbnzYnv4_rQA53K7O5z", // Fallback to ID from sample
                options: []
            }
        };

        console.log('📦 Creating order...');
        const order = await onroService.createBooking(payload);
        console.log('✅ Order created successfully!');
        console.log('Order ID:', order.data.id);

        return order.data.id;

    } catch (error) {
        console.error('❌ Error creating order:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

testCreateRealOrder();
