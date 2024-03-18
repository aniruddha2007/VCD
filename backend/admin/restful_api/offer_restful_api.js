// Purpose: Create a RESTful API for Offer's Database CRUD operations on a MongoDB database
const express = require('express');
const router = express.Router();
const {
    MongoClient,
    ObjectId
} = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

//CRUD operations for offer_db/offers
//Create
router.post('/offers/create', async (req, res, next) => {
    try {
        const {
            sender,
            timestamp,
            user,
            min_gar,
            max_gar,
            min_ash,
            max_ash,
            volume,
            laycan,
            port
        } = req.body;

        // Check if data is complete
        let missingFields = [];
        if (!sender) missingFields.push('sender');
        if (!timestamp) missingFields.push('timestamp');
        if (!user) missingFields.push('user');
        if (!min_gar) missingFields.push('min_gar');
        if (!max_gar) missingFields.push('max_gar');
        if (!min_ash) missingFields.push('min_ash');
        if (!max_ash) missingFields.push('max_ash');
        if (!volume) missingFields.push('volume');
        if (!laycan) missingFields.push('laycan');
        if (!port) missingFields.push('port');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        await client.connect();
        const database = client.db('offer_db');
        const offer_messages = database.collection('offer_messages');

        // Check if the entry already exists
        const existingOffer = await offer_messages.findOne({
            sender,
            timestamp,
            'user._id': user._id // For backward compatibility
        });

        // If user._id is not present, check for user.wa_id
        if (!existingOffer && user.wa_id) {
            const existingOfferByWaId = await offer_messages.findOne({
                sender,
                timestamp,
                'user.wa_id': user.wa_id
            });

            if (existingOfferByWaId) {
                return res.status(200).json({
                    message: 'Entry already exists'
                });
            }
        }

        // If neither user._id nor user.wa_id is present, proceed with insertion
        if (!existingOffer) {
            const new_offer = req.body;
            const result = await offer_messages.insertOne(new_offer);

            return res.json({
                id: result.insertedId
            });
        }

        return res.status(200).json({
            message: 'Entry already exists'
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Read
router.get('/offers/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const offer_messages = database.collection('offer_messages');

        const allOffers = await offer_messages.find().toArray();

        res.json(allOffers);
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Update
router.put('/offers/update/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const offer_messages = database.collection('offer_messages');

        const query = {
            _id: req.params.id
        };
        const update = {
            $set: req.body
        };

        const updateResult = await offer_messages.updateOne(query, update);

        res.json({
            matchedCount: updateResult.matchedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Delete
router.delete('/offers/delete/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const offer_messages = database.collection('offer_messages');

        const deleteResult = await offer_messages.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//CRUD for offer_db/today_offer_collection
//CRUD operations
//Create
router.post('/today_offer/create', async (req, res, next) => {
    try {
        const {
            order,
            offer_id
        } = req.body;

        // Check if data is complete
        let missingFields = [];
        if (!order) missingFields.push('order');
        if (!offer_id) missingFields.push('offer_id');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        await client.connect();
        const database = client.db('offer_db');
        const today_offer_collection = database.collection('today_offer_collection');

        // Check if the entry already exists
        const existingOffer = await today_offer_collection.findOne({
            order,
            'offer_id.$oid': offer_id.$oid
        });
        if (existingOffer) {
            return res.status(200).json({
                message: 'Entry already exists'
            });
        }

        const new_offer = req.body;
        const result = await today_offer_collection.insertOne(new_offer);

        res.json({
            id: result.insertedId
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Read
router.get('/today_offer/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const today_offer_collection = database.collection('today_offer_collection');

        const allOffers = await today_offer_collection.find().toArray();

        res.json(allOffers);
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Update
router.put('/today_offer/update/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const today_offer_collection = database.collection('today_offer_collection');

        const query = {
            _id: req.params.id
        };
        const update = {
            $set: req.body
        };

        const updateResult = await today_offer_collection.updateOne(query, update);

        res.json({
            matchedCount: updateResult.matchedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Delete
router.delete('/today_offer/delete/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const today_offer_collection = database.collection('today_offer_collection');

        const deleteResult = await today_offer_collection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//CRUD for offer_db/selected_offers
//CRUD operations
//Create
router.post('/selected_offers/create', async (req, res, next) => {
    try {
        const {
            order,
            sender,
            timestamp,
            offer_id
        } = req.body;

        // Check if data is complete
        let missingFields = [];
        if (!order) missingFields.push('order');
        if (!offer_id) missingFields.push('offer_id');
        if (!sender) missingFields.push('sender');
        if (!timestamp) missingFields.push('timestamp');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        await client.connect();
        const database = client.db('offer_db');
        const selected_offers = database.collection('selected_offer_messages');

        // Check if the entry already exists
        const existingOffer = await selected_offers.findOne({
            order,
            'offer_id.$oid': offer_id.$oid,
            sender,
        });
        if (existingOffer) {
            return res.status(200).json({
                message: 'Entry already exists'
            });
        }

        const new_offer = req.body;
        const result = await selected_offers.insertOne(new_offer);

        res.json({
            id: result.insertedId
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Read
router.get('/selected_offers/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const selected_offers = database.collection('selected_offer_messages');

        const allOffers = await selected_offers.find().toArray();

        res.json(allOffers);
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Update
router.put('/selected_offers/update/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const selected_offers = database.collection('selected_offer_messages');

        const query = {
            _id: req.params.id
        };
        const update = {
            $set: req.body
        };

        const updateResult = await selected_offers.updateOne(query, update);

        res.json({
            matchedCount: updateResult.matchedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Delete
router.delete('/selected_offers/delete/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('offer_db');
        const selected_offers = database.collection('selected_offer_messages');

        const deleteResult = await selected_offers.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

module.exports = router;