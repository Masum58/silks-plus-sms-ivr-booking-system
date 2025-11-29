const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./src/config/config');
const apiRoutes = require('./src/routes/api');
const smsRoutes = require('./src/routes/sms');
const vapiRoutes = require('./src/routes/vapi');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);
app.use('/sms', smsRoutes);
app.use('/vapi', vapiRoutes);  // SMS webhook routes

// Serve static files from public directory
app.use(express.static('public'));

// Root route (fallback if no static file found, though index.html usually takes precedence)
app.get('/api', (req, res) => {
    res.send('SMS + IVR Booking Add-On Middleware is running');
});

// Start server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
});
