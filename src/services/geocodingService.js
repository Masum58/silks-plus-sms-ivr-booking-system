const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

class GeocodingService {
    constructor() {
        this.client = new Client({ timeout: 5000 }); // 5s timeout
    }

    async getCoordinates(address) {
        try {
            console.log(`🗺️  Geocoding address: ${address}`);

            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: config.googleMaps.apiKey
                }
            });

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                const coords = [location.lng, location.lat]; // [longitude, latitude]

                console.log(`✅ Geocoded to: [${coords[0]}, ${coords[1]}]`);
                return coords;
            }

            // Fallback to [0, 0] if geocoding fails
            console.warn(`⚠️  Geocoding failed for address: ${address}`);
            return [0, 0];

        } catch (error) {
            console.error('❌ Geocoding error:', error.message);
            return [0, 0]; // Fallback
        }
    }
}

module.exports = new GeocodingService();
