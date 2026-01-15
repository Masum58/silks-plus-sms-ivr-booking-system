const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

class GeocodingService {
    constructor() {
        this.client = new Client({ timeout: 5000 }); // 5s timeout
        this.apiKey = config.googleMaps.apiKey;
    }

    async getCoordinates(address) {
        console.log(`🗺️  Geocoding address: ${address}`);

        if (!address || address.trim().length < 2) {
            throw new Error('Address is too short.');
        }

        // Enrich address with city/state if missing to help Google Maps
        let enrichedAddress = address;
        if (!address.toLowerCase().includes('monroe')) {
            enrichedAddress += ', Monroe, NY';
        } else if (!address.toLowerCase().includes('ny') && !address.toLowerCase().includes('new york')) {
            enrichedAddress += ', NY';
        }

        console.log(`🔍 Searching for: ${enrichedAddress}`);

        try {
            const response = await this.client.geocode({
                params: {
                    address: enrichedAddress,
                    key: this.apiKey,
                    components: 'country:US|administrative_area:NY',
                },
                timeout: 5000
            });

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                const result = response.data.results[0];
                const location = result.geometry.location;
                const formattedAddress = result.formatted_address;

                console.log(`✅ Geocoded to: [${location.lng}, ${location.lat}]`);
                console.log(`   Formatted: ${formattedAddress}`);

                return [location.lng, location.lat];
            } else if (response.data.status === 'ZERO_RESULTS') {
                throw new Error(`I couldn't find the address "${address}". Please ask for more details.`);
            } else {
                throw new Error(`Unable to verify the address "${address}".`);
            }
        } catch (error) {
            console.error('Geocoding error:', error.message);
            throw error;
        }
    }
}

module.exports = new GeocodingService();
