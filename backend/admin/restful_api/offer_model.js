//Offer Schema is defined here
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    sender: String,
    timestamp: String,
    user: {
        userId: String,
        category: String
    },
    country: String,
    mine_name: String,
    typical_gar: String,
    typical_ash: String,
    typical_sulphur: String,
    volume: String,
    laycan: String,
    port: String,
    status: String,
    pdf: Buffer // Store PDF data as Buffer
});

// Create model from schema
const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;