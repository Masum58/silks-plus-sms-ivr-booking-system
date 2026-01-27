const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

class GeocodingService {
    constructor() {
        this.client = new Client({ timeout: 15000 }); // 15s timeout
        this.apiKey = config.googleMaps.apiKey;
        this.cache = new Map(); // Simple in-memory cache
    }

    async getCoordinates(address) {
        if (!address || address.trim().length < 2) return null;

        const cacheKey = address.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            console.log(`🚀 Geocoding Cache Hit: ${address}`);
            return this.cache.get(cacheKey);
        }

        console.log(`🗺️  Geocoding address: ${address}`);

        // Enrich address with city/state if missing to help Google Maps
        let enrichedAddress = address;
        const hasCityOrZip = /(monroe|harriman|kiryas joel|woodbury|central valley|ny|new york|\d{5})/i.test(address);

        if (!hasCityOrZip) {
            enrichedAddress += ', Monroe, NY';
        } else if (!/ny|new york/i.test(address)) {
            enrichedAddress += ', NY';
        }

        try {
            const response = await this.client.geocode({
                params: {
                    address: enrichedAddress,
                    key: this.apiKey,
                    components: 'country:US|administrative_area:NY',
                },
                timeout: 10000
            });

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                const result = response.data.results[0];
                const location = result.geometry.location;
                const coords = [location.lng, location.lat];

                console.log(`✅ Geocoded: [${coords}]`);
                this.cache.set(cacheKey, coords);
                return coords;
            }
            return null;
        } catch (error) {
            console.error('Geocoding error:', error.message);
            return null;
        }
    }
}

module.exports = new GeocodingService();
