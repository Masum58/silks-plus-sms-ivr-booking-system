const axios = require('axios');

async function simulateSmsBooking() {
    console.log('🚀 Simulating Incoming SMS Booking...');

    const payload = {
        From: '+8801317365623',
        Body: 'Book from 6 Fillmore Court to 12 Prag Boulevard',
        MessageSid: 'SM' + Math.random().toString(36).substring(7),
        NumMedia: '0'
    };

    try {
        const response = await axios.post('http://localhost:3000/sms/receive',
            new URLSearchParams(payload).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        console.log('📥 Server Response:');
        console.log(response.data);
    } catch (error) {
        console.error('❌ Simulation Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

simulateSmsBooking();
