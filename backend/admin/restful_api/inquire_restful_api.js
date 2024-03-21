const express = require('express');
const {
    MongoClient,
    ObjectId
} = require("mongodb");

const router = express.Router();

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/* This code block defines CRUD (Create, Read, Update, Delete) operations for a collection named
`inquire_messages` in a MongoDB database named `inquire_db`. Here's a breakdown of what each part of
the code does: */
// CRUD operations for inquire_db/inquires
// Create
router.post('/inquires/create', async (req, res, next) => {
    try {
        await client.connect();
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

        const requiredFields = {
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
        };
        const missingFields = Object.entries(requiredFields).filter(([key, value]) => !value).map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        const database = client.db('inquire_db');
        const inquire_messages = database.collection('inquire_messages');

        const existingInquire = await inquire_messages.findOne({
            sender,
            timestamp,
            'user._id': user._id
        });

        if (!existingInquire && user.wa_id) {
            const existingInquireByWaId = await inquire_messages.findOne({
                sender,
                timestamp,
                'user.wa_id': user.wa_id
            });
            if (existingInquireByWaId) return res.status(200).json({
                message: 'Entry already exists'
            });
        }

        if (!existingInquire) {
            const result = await inquire_messages.insertOne(req.body);
            return res.json({
                id: result.insertedId
            });
        }

        return res.status(200).json({
            message: 'Entry already exists'
        });
    } catch (error) {
        next(error);
    }
});

// Read
router.get('/inquires/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const inquire_messages = database.collection('inquire_messages');
        const allInquires = await inquire_messages.find().toArray();
        res.json(allInquires);
    } catch (error) {
        next(error);
    }
});

// Update
router.put('/inquires/update/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const inquire_messages = database.collection('inquire_messages');
        const query = {
            _id: req.params.id
        };
        const update = {
            $set: req.body
        };
        const updateResult = await inquire_messages.updateOne(query, update);
        res.json({
            matchedCount: updateResult.matchedCount
        });
    } catch (error) {
        next(error);
    }
});

// Delete
router.delete('/inquires/delete/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const inquire_messages = database.collection('inquire_messages');
        const deleteResult = await inquire_messages.deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.json({
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        next(error);
    }
});

/* This code block defines CRUD (Create, Read, Update, Delete) operations for a collection named
`today_inquires_collection` in a MongoDB database named `inquire_db`. Here's a breakdown of what
each part of the code does: */
// CRUD for inquire_db/today_inquires_collection
// Create
router.post('/today_inquires/create', async (req, res, next) => {
    try {
        await client.connect();
        const {
            order,
            inquire_id
        } = req.body;
        const requiredFields = {
            order,
            inquire_id
        };
        const missingFields = Object.entries(requiredFields).filter(([key, value]) => !value).map(([key]) => key);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }
        const database = client.db('inquire_db');
        const today_inquire_collection = database.collection('today_inquire_collection');
        const existingInquire = await today_inquire_collection.findOne({
            order,
            'inquire_id.$oid': inquire_id.$oid
        });
        if (existingInquire) return res.status(200).json({
            message: 'Entry already exists'
        });
        const result = await today_inquire_collection.insertOne(req.body);
        res.json({
            id: result.insertedId
        });
    } catch (error) {
        next(error);
    }
});

// Read
router.get('/today_inquires/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const today_inquire_collection = database.collection('today_inquire_collection');
        const allInquires = await today_inquire_collection.find().toArray();
        res.json(allInquires);
    } catch (error) {
        next(error);
    }
});

// Update
router.put('/today_inquires/update/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const today_inquire_collection = database.collection('today_inquire_collection');
        const query = {
            _id: req.params.id
        };
        const update = {
            $set: req.body
        };
        const updateResult = await today_inquire_collection.updateOne(query, update);
        res.json({
            matchedCount: updateResult.matchedCount
        });
    } catch (error) {
        next(error);
    }
});

// Delete
router.delete('/today_inquires/delete/:id', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('inquire_db');
        const today_inquire_collection = database.collection('today_inquire_collection');
        const deleteResult = await today_inquire_collection.deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.json({
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;