const axios = require('axios');

async function checkUrl(url) {
    try {
        console.log(`Checking ${url}...`);
        const response = await axios.get(url);
        console.log(`✅ ${url} exists! Status: ${response.status}`);
    } catch (error) {
        console.log(`❌ ${url} failed: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
        }
    }
}

async function test() {
    await checkUrl('https://api.swiflymessenger.com');
    await checkUrl('https://manage.swiflymessenger.com/api');
    await checkUrl('https://api.onro.com');
}

test();
