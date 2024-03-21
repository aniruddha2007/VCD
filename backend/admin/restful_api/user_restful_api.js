const express = require('express');
const router = express.Router();
const {
    MongoClient,
    ObjectId
} = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

/* This code snippet is defining CRUD (Create, Read, Update, Delete) operations for a user database
using Express.js and MongoDB. Here's a breakdown of each operation: */
//CRUD operations for User's Database
//Create
router.post('/users/create', async (req, res, next) => {
    try {
        console.log("Creating a new user...");
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
        console.log("Connected to the database");

        const database = client.db('user_data');
        const user = database.collection('users');

        // Check if the entry already exists
        const existing_user = await user.findOne({
            wa_id,
            category,
            userId
        });
        if (existing_user) {
            console.log("Entry already exists");
            return res.status(200).json({
                message: 'Entry already exists'
            });
        }

        const new_user = req.body;
        const result = await user.insertOne(new_user);
        console.log("New user created:", result.insertedId);

        res.json({
            id: result.insertedId
        });
    } catch (error) {
        console.error("Error creating user:", error);
        next(error);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
});

//Read
router.get('/users/read', async (req, res, next) => {
    try {
        console.log("Reading users from the database...");
        await client.connect();
        console.log("Connected to the database");

        const database = client.db('user_data');
        const user = database.collection('users');
        const result = await user.find({}).toArray();

        console.log("Users retrieved:", result.length);
        res.json(result);
    } catch (error) {
        console.error("Error reading users:", error);
        next(error);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
});

//Update
router.put('/users/update/:id', async (req, res, next) => {
    try {
        console.log("Updating user...");
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
        console.log("Connected to the database");

        const database = client.db('user_data');
        const user = database.collection('users');

        const result = await user.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: req.body
        });

        if (result.matchedCount === 0) {
            console.log("User not found");
            throw new NotFoundError('Entry not found');
        }

        console.log("User updated:", id);
        res.json({
            message: 'Entry updated'
        });
    } catch (error) {
        console.error("Error updating user:", error);
        next(error);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
});

//Delete
router.delete('/users/delete/:id', async (req, res, next) => {
    try {
        console.log("Deleting user...");
        await client.connect();
        console.log("Connected to the database");

        const database = client.db('user_data');
        const user = database.collection('users');

        const result = await user.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            console.log("User not found");
            throw new NotFoundError('Entry not found');
        }

        console.log("User deleted:", req.params.id);
        res.json({
            message: 'Entry deleted'
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        next(error);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
});

module.exports = router;
