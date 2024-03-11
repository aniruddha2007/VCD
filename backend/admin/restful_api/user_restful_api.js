// Description: This file contains the RESTful API for the user_data database.
const express = require('express');
const router = express.Router();
const {
    MongoClient,
    ObjectId
} = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

//CRUD operations for User's Database
//Create
router.post('/users/create', async (req, res, next) => {
    try {
        const {
            wa_id,
            category,
            userId
        } = req.body;

        // Check if data is complete
        let missingFields = [];
        if (!wa_id && !userId) {
            missingFields.push('wa_id or userId');
        }
        if (!category) {
            missingFields.push('category');
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        await client.connect();
        const database = client.db('user_data');
        const user = database.collection('users');

        // Check if the entry already exists
        const existing_user = await user.findOne({
            wa_id,
            category,
            userId
        });
        if (existing_user) {
            return res.status(200).json({
                message: 'Entry already exists'
            });
        }

        const new_user = req.body;
        const result = await user.insertOne(new_user);

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
router.get('/users/read', async (req, res, next) => {
    try {
        await client.connect();
        const database = client.db('user_data');
        const user = database.collection('users');
        const result = await user.find({}).toArray();
        res.json(result);
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Update
router.put('/users/update/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            wa_id,
            category,
            userId
        } = req.body;

        // Check if data is complete
        let missingFields = [];
        if (!wa_id && !userId) {
            missingFields.push('wa_id or userId');
        }
        if (!category) {
            missingFields.push('category');
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete data',
                missing: missingFields
            });
        }

        await client.connect();
        const database = client.db('user_data');
        const user = database.collection('users');

        const result = await user.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: req.body
        });

        if (result.matchedCount === 0) {
            throw new NotFoundError('Entry not found');
        }

        res.json({
            message: 'Entry updated'
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});

//Delete
router.delete('/users/delete/:id', async (req, res, next) => {
    try {

        await client.connect();
        const database = client.db('user_data');
        const user = database.collection('users');

        const result = await user.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            throw new NotFoundError('Entry not found');
        }

        res.json({
            message: 'Entry deleted'
        });
    } catch (error) {
        next(error);
    } finally {
        await client.close();
    }
});
module.exports = router;