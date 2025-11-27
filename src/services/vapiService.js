const config = require('../config/config');

class VapiService {
    constructor() {
        this.assistantId = config.vapi.assistantId;
        this.publicKey = config.vapi.publicKey;
    }

    getWebCallConfig() {
        return {
            assistantId: this.assistantId,
            publicKey: this.publicKey,
        };
    }

    // Future methods for handling Vapi webhooks or server-side calls
}

module.exports = new VapiService();
