const express = require('express');
const bodyParser = require('body-parser');
const offer_api = require('./offer_restful_api');
const user_api = require('./user_restful_api');
const cors = require('cors');


// Create a new express application
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Middleware for API key authentication  FYI need to use x-api-key in the header
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({
            error: 'No API key provided'
        });
    }

    // Check if API key is valid
    // Replace 'your_api_key' with your actual API key
    if (apiKey !== 'aniruddhaqwerty1234') {
        return res.status(401).json({
            error: 'Invalid API key'
        });
    }

    next();
}
// Use the API key authentication middleware
app.use(authenticateApiKey);

app.use('/offer_db', offer_api);

app.use('/user_data', user_api);

// Error classes
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof NotFoundError || err instanceof BadRequestError) {
        res.status(err.statusCode).json({
            error: err.message
        });
    } else {
        console.error(err.stack);
        res.status(500).send({
            error: 'Internal server error'
        });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));