const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/config');

// Hardcoded Alias Map for Monroe, NY and surrounding areas
const ALIAS_MAP = {
    // Street Name Variations
    'tutania': 'Titania Boulevard, Monroe, NY',
    'austra': 'Austra Parkway, Monroe, NY',
    'austro': 'Austra Parkway, Monroe, NY',
    'oscar': 'Austra Parkway, Monroe, NY',
    'oster': 'Austra Parkway, Monroe, NY',
    'ostra': 'Austra Parkway, Monroe, NY',
    'austro': 'Austra Parkway, Monroe, NY',
    'auster': 'Austra Parkway, Monroe, NY',
    'parkway': 'Austra Parkway, Monroe, NY',
    'a u s t r a': 'Austra Parkway, Monroe, NY',
    'austra parkway': 'Austra Parkway, Monroe, NY',
    'banburen': 'Van Buren Drive, Monroe, NY',
    'van buren': 'Van Buren Drive, Monroe, NY',
    'beer sheva': 'Beer Sheva Street, Monroe, NY',
    'bar shaver': 'Beer Sheva Street, Monroe, NY',
    'ice shaver': 'Beer Sheva Street, Monroe, NY',
    'morong': 'Morong Drive, Monroe, NY',
    'moran': 'Morong Drive, Monroe, NY',
    'merrong': 'Morong Drive, Monroe, NY',
    'route 17m': 'Route 17M, Monroe, NY',
    'route 17 meter': 'Route 17M, Monroe, NY',
    'bakertown': 'Bakertown Road, Monroe, NY',
    'carriage hill': 'Carriage Hill Court, Monroe, NY',
    'van arsdale': 'Van Arsdale Road, Monroe, NY',
    'main street': 'North Main Street, Monroe, NY',
    'lake street': 'Lake Street, Monroe, NY',
    'forest road': 'Forest Road, Monroe, NY',
    'smith farm': 'Smith Farm Road, Monroe, NY',
    'bailey farm': 'Bailey Farm Road, Monroe, NY',
    'ledge road': 'Ledge Road, Monroe, NY',
    'mountain lodge': 'Mountain Lodge Road, Monroe, NY',
    'orchard street': 'Orchard Street, Monroe, NY',
    'maple avenue': 'Maple Avenue, Monroe, NY',
    'elm street': 'Elm Street, Monroe, NY',
    'high street': 'High Street, Monroe, NY',
    'stage road': 'Stage Road, Monroe, NY',
    'old stage road': 'Old Stage Road, Monroe, NY',
    'woodcock': 'Woodcock Mountain Road, Monroe, NY',
    'clove road': 'Clove Road, Monroe, NY',
    'doxbury': 'Doxbury Lane, Monroe, NY',
    'cromwell': 'Cromwell Hill Road, Monroe, NY',
    'jersey': 'Jersey Avenue, Monroe, NY',
    'millpond': 'Millpond Parkway, Monroe, NY',
    'museum village': 'Museum Village Road, Monroe, NY',
    'moffat': 'Moffat Road, Monroe, NY',
    'pleasant hill': 'Pleasant Hill Road, Monroe, NY',
    'rye hill': 'Rye Hill Road, Monroe, NY',
    'walton': 'Walton Terrace, Monroe, NY',
    'park avenue': 'Park Avenue, Monroe, NY',
    'oxford': 'Oxford Road, Monroe, NY',
    'chestnut': 'Chestnut Street, Monroe, NY',
    'hudson': 'Hudson Street, Monroe, NY',
    'franklin': 'Franklin Street, Monroe, NY',
    'washington': 'Washington Street, Monroe, NY',
    'liberty': 'Liberty Street, Monroe, NY',
    'highland': 'Highland Avenue, Monroe, NY',
    'baker': 'Baker Street, Monroe, NY',
    'church': 'Church Street, Monroe, NY',
    'still': 'Still Road, Monroe, NY',
    'hillside': 'Hillside Drive, Monroe, NY',
    'sunset': 'Sunset Drive, Monroe, NY',
    'brookside': 'Brookside Drive, Monroe, NY',
    'valley view': 'Valley View Drive, Monroe, NY',
    'birchwood': 'Birchwood Drive, Monroe, NY',
    'dogwood': 'Dogwood Lane, Monroe, NY',
    'hemlock': 'Hemlock Lane, Monroe, NY',
    'oak ridge': 'Oak Ridge Road, Monroe, NY',
    'pine tree': 'Pine Tree Lane, Monroe, NY',
    'cedar': 'Cedar Drive, Monroe, NY',
    'fox run': 'Fox Run Lane, Monroe, NY',
    'deer path': 'Deer Path Drive, Monroe, NY',
    'meadow': 'Meadow Lane, Monroe, NY',
    'fairway': 'Fairway Drive, Monroe, NY',
    'country club': 'Country Club Drive, Monroe, NY',
    'lakewood': 'Lakewood Drive, Monroe, NY',
    'knolls': 'Knolls Drive, Monroe, NY',
    'ridge': 'Ridge Road, Monroe, NY',
    'rolling hills': 'Rolling Hills Drive, Monroe, NY',
    'spring': 'Spring Street, Monroe, NY',
    'wintergreen': 'Wintergreen Avenue, Monroe, NY',
    'evergreen': 'Evergreen Road, Monroe, NY',
    'school': 'School Road, Monroe, NY',
    'arbutus': 'Arbutus Lane, Monroe, NY',
    'aspen': 'Aspen Court, Monroe, NY',
    'sycamore': 'Sycamore Lane, Monroe, NY',
    'willow': 'Willow Avenue, Monroe, NY',
    'spruce': 'Spruce Street, Monroe, NY',
    'laurel': 'Laurel Avenue, Monroe, NY',
    'magnolia': 'Magnolia Drive, Monroe, NY',
    'hawthorne': 'Hawthorne Drive, Monroe, NY',
    'juniper': 'Juniper Lane, Monroe, NY',
    'timber': 'Timber Trail, Monroe, NY',
    'stonegate': 'Stonegate Drive, Monroe, NY',
    'fieldstone': 'Fieldstone Drive, Monroe, NY',
    'heritage': 'Heritage Drive, Monroe, NY',
    'colonial': 'Colonial Drive, Monroe, NY',

    // Special Locations / Landmarks
    'kj': 'Kiryas Joel, NY',
    'hayes corner': 'Hayes Court & Garfield Road, Kiryas Joel, NY',
    'jewish school': '3 YD Goldberger Drive, Monroe, NY',
    'wedding hall': '18 Getzil Berger Blvd, Monroe, NY',
    'paradise hall': '5 Israel Zupnick Drive, Monroe, NY',
    'donatus': 'Donatus Estates, Monroe, NY 10950',
    'cyd': '3 YD Goldberger Drive, Monroe, NY',
    'pyd': '3 YD Goldberger Drive, Monroe, NY',
    'yd': '3 YD Goldberger Drive, Monroe, NY',
    'gold berger': '3 YD Goldberger Drive, Monroe, NY',
    'mezabish': '2 Mezabish Place, Kiryas Joel, NY',
    'lizensk': '9 Lizensk Boulevard, Monroe, NY',
    'orshava': '5 Orshava Court, Monroe, NY',
    'prag': '12 Prag Boulevard, Kiryas Joel, NY',
    'krolla': '8 Krolla Drive, Kiryas Joel, NY',
    'fillmore': '6 Fillmore Court, Kiryas Joel, NY',
    'lizensk': '9 Lizensk Boulevard, Monroe, NY',
    'shiva state': '6 Beer Sheva Street, Kiryas Joel, NY',
    'where shiva is state': '6 Beer Sheva Street, Kiryas Joel, NY',
    'chavez': 'Beer Sheva Street, Monroe, NY',
    'chavez street': 'Beer Sheva Street, Monroe, NY',
    'chess street': 'Beer Sheva Street, Monroe, NY'
};

class GeocodingService {
    constructor() {
        this.client = new Client({ timeout: 15000 }); // 15s timeout
        this.apiKey = config.googleMaps.apiKey;
        this.cache = new Map(); // Simple in-memory cache

        // Pre-populate cache with common aliases to skip Google Maps API calls
        // Format: [longitude, latitude]
        const COMMON_COORDS = {
            'titania boulevard, monroe, ny': [-74.19532, 41.34005],
            'austra parkway, monroe, ny': [-74.161116, 41.330452],
            'van buren drive, monroe, ny': [-74.17056, 41.33861],
            'beer sheva street, monroe, ny': [-74.161059, 41.329321],
            '3 yd goldberger drive, monroe, ny': [-74.175853, 41.335861],
            'hayes court & garfield road, kiryas joel, ny': [-74.168, 41.336],
            '18 getzil berger blvd, monroe, ny': [-74.172, 41.334],
            '5 israel zupnick drive, monroe, ny': [-74.178, 41.332],
            'kiryas joel, ny': [-74.168, 41.340]
        };

        for (const [key, coords] of Object.entries(COMMON_COORDS)) {
            this.cache.set(key, coords);
        }
    }

    /**
     * Normalize address using Alias Map
     * @param {string} address 
     * @returns {string} Normalized address
     */
    normalizeAddress(address) {
        if (!address) return address;

        const lowerAddress = address.toLowerCase().trim();

        // 1. Direct hit in alias map
        if (ALIAS_MAP[lowerAddress]) {
            console.log(`🔄 Alias Corrected: "${address}" -> "${ALIAS_MAP[lowerAddress]}"`);
            return ALIAS_MAP[lowerAddress];
        }

        // 2. Partial match check (e.g. "pick up at Tutania") - simplified for safety
        // We iterate through keys and see if the address *contains* the key
        // BUT we must be careful not to match partial words (e.g. "Main" matching "Maine")
        // For now, we rely on the specific alias keys being somewhat unique or we check specific phrases.

        for (const [key, value] of Object.entries(ALIAS_MAP)) {
            // Check if address ends with key or implies key strongly
            // Example: "16 Tutania" -> we should probably keep number?
            // Current Logic: If the user says "Tutania", we replace it.
            // If they say "123 Tutania", we might want "123 Titania Blvd".

            // Regex to match whole word alias
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(address)) {
                // If it's a street name alias, replace only the street name part if possible,
                // OR just append the city context if it's a known street name.

                // Simple replacement strategy:
                // If the key is "tutania" and value is "Titania Boulevard, Monroe, NY"
                // and input is "15 Tutania", result -> "15 Titania Boulevard, Monroe, NY"

                // Extract the street part from the Value (remove city/state) for replacement
                let streetOnly = value.split(',')[0].trim();

                // If the address already contains the suffix (e.g. "Oster Parkway" -> "Austra Parkway"),
                // don't append it again if it's already there.
                // But normalizeAddress is usually simpler: if we find "oster", we replace it with "Austra Parkway".
                // If the original was "Oster Parkway", we'd get "Austra Parkway Parkway".
                // Let's fix that by checking if the next word is the same suffix.

                const fixed = address.replace(regex, streetOnly).replace(/\b(Parkway|Drive|Street|Road|Boulevard|Avenue|Court)\s+\1\b/gi, '$1');
                console.log(`🔄 Regex Corrected: "${address}" -> "${fixed}"`);
                return fixed;
            }
        }

        return address;
    }

    async getCoordinates(address) {
        if (!address || address.trim().length < 2) return null;

        // STEP 1: Normalize / Alias Check
        const normalizedAddress = this.normalizeAddress(address);

        const cacheKey = normalizedAddress.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            console.log(`🚀 Geocoding Cache Hit: ${normalizedAddress}`);
            return this.cache.get(cacheKey);
        }

        console.log(`🗺️  Geocoding address: ${normalizedAddress}`);

        // Enrich address with city/state if missing to help Google Maps
        let enrichedAddress = normalizedAddress;

        // Only enrich if it doesn't already look like a full address (comma check)
        // or if it doesn't match our known city list
        const cityRegex = /(monroe|harriman|kiryas joel|woodbury|central valley|new york|ny|bronx|brooklyn|queens|manhattan|staten island|middletown|newburgh|poughkeepsie|spring valley|suffern|mahwah|chester|goshen|washingtonville|blooming grove|highland mills|tuxedo|kingston|albany|\d{5})/i;
        const hasCityOrZip = cityRegex.test(normalizedAddress);

        if (!hasCityOrZip) {
            enrichedAddress += ', Monroe, NY';
        } else if (!/ny|new york/i.test(normalizedAddress)) {
            // If it has city but no state, add NY (e.g. "Brooklyn" -> "Brooklyn, NY")
            // But be careful not to double add if "NY" is part of street name (unlikely)
            enrichedAddress += ', NY';
        }

        try {
            const response = await this.client.geocode({
                params: {
                    address: enrichedAddress,
                    key: this.apiKey,
                    components: 'country:US|administrative_area:NY',
                },
                timeout: 20000
            });

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                const result = response.data.results[0];
                const location = result.geometry.location;
                // Add robustness: Check if result is a geometric_center or approximate
                // For taxi, we tolerate it, but ROOFTOP is best.

                const coords = [location.lng, location.lat];

                console.log(`✅ Geocoded: "${enrichedAddress}" -> [${coords}]`);
                this.cache.set(cacheKey, coords);
                return coords;
            }
            console.warn(`⚠️ Geocoding failed for: ${enrichedAddress}, Status: ${response.data.status}`);
            return null;
        } catch (error) {
            console.error('Geocoding error:', error.message);
            return null;
        }
    }

    /**
     * Get route directions between two addresses
     * @param {string} origin 
     * @param {string} destination 
     * @returns {Promise<Object|null>} Route details including distance, duration, and points
     */
    async getRoute(origin, destination) {
        if (!origin || !destination) return null;

        const normalizedOrigin = this.normalizeAddress(origin);
        const normalizedDest = this.normalizeAddress(destination);

        console.log(`🛣️  Calculating route: "${normalizedOrigin}" -> "${normalizedDest}"`);

        try {
            const response = await this.client.directions({
                params: {
                    origin: normalizedOrigin,
                    destination: normalizedDest,
                    key: this.apiKey,
                    mode: 'driving'
                },
                timeout: 20000
            });

            if (response.data.status === 'OK' && response.data.routes.length > 0) {
                const route = response.data.routes[0];
                const leg = route.legs[0];

                const distance = leg.distance.value; // in meters
                const duration = leg.duration.value; // in seconds
                const points = this.decodePolyline(route.overview_polyline.points);

                console.log(`✅ Route calculated: ${distance}m, ${duration}s, ${points.length / 2} points`);

                return {
                    distance,
                    duration,
                    points
                };
            }
            console.warn(`⚠️ Route calculation failed, Status: ${response.data.status}`);
            return null;
        } catch (error) {
            console.error('Route calculation error:', error.message);
            return null;
        }
    }

    /**
     * Decode Google Maps polyline to flat array of micro-degree integers [lng, lat, lng, lat...]
     * @param {string} encoded 
     * @returns {number[]} Flat array of micro-degree integers
     */
    decodePolyline(encoded) {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            // Google Polyline uses 1e-5 degrees. TaxiCaller uses micro-degrees (1e-6).
            // Multiply by 10 to convert.
            // Array order: [Longitude, Latitude] as per TaxiCaller spec.
            points.push(Math.round(lng * 10));
            points.push(Math.round(lat * 10));
        }
        return points;
    }
}

module.exports = new GeocodingService();
