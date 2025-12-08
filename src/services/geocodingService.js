const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

class GeocodingService {
    constructor() {
        this.client = new Client({ timeout: 5000 }); // 5s timeout
        this.apiKey = config.googleMaps.apiKey;
    }

    async getCoordinates(address) {
        console.log(`🗺️  Geocoding address: ${address}`);

        // Validate address format first
        if (!address || address.trim().length < 5) {
            throw new Error('Address is too short. Please provide a complete address with street, city, state, and ZIP code.');
        }

        // Check if address contains essential components
        const hasNumber = /\d/.test(address);
        const hasState = /NY|New York/i.test(address);
        const hasZip = /\d{5}/.test(address);

        if (!hasNumber) {
            throw new Error('Address must include a street number. Please ask the customer for the complete street address.');
        }

        if (!hasState) {
            throw new Error('Address must include the state (NY or New York). Please ask the customer to confirm the state.');
        }

        if (!hasZip) {
            throw new Error('Address must include a 5-digit ZIP code. Please ask the customer for the ZIP code.');
        }

        try {
            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: this.apiKey,
                    // Bias results to Monroe, NY area
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

                // Validate that the address is in the service area (Monroe, NY)
                const isInMonroe = formattedAddress.includes('Monroe') && formattedAddress.includes('NY');

                if (!isInMonroe) {
                    console.log(`⚠️  Address may be outside Monroe, NY: ${formattedAddress}`);
                    // Still return coordinates but log warning
                }

                return [location.lng, location.lat];
            } else if (response.data.status === 'ZERO_RESULTS') {
                // Address not found - provide helpful error
                throw new Error(`I couldn't find that address. The address "${address}" doesn't appear to be valid. Please ask the customer to verify the street name, city, and ZIP code. Common streets in Monroe, NY include Austra Parkway and Van Buren Drive.`);
            } else {
                throw new Error(`Unable to verify the address "${address}". Please ask the customer to spell out the street name letter by letter.`);
            }
        } catch (error) {
            if (error.message.includes("couldn't find") || error.message.includes("Unable to verify") || error.message.includes("Address is too short") || error.message.includes("Address must include")) {
                throw error; // Re-throw our custom errors
            }

            console.error('Geocoding error:', error.message);
            throw new Error(`I'm having trouble verifying that address. Please ask the customer to provide the complete address including street number, street name, city (Monroe), state (NY), and ZIP code (10950).`);
        }
    }
}

module.exports = new GeocodingService();
