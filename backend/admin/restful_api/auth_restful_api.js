const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

client.connect();

const SECRET_KEY = 'aniruddhaqwerty1234';

const db = client.db('auth_db'); // Replace 'auth_db' with your database name
const usersCollection = db.collection('users'); // Replace 'users' with your collection name

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      username,
      password: hashedPassword
    };

    // Save the new user to the database
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
