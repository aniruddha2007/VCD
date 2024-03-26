const express = require("express");
const bodyParser = require("body-parser");
const offer_api = require("./offer_restful_api");
const user_api = require("./user_restful_api");
const inquire_api = require("./inquire_restful_api");
const offer_coa_upload_api = require("./offer_coa_upload_restful_api");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

/* The code snippet you provided is connecting the Express application to a MongoDB database. Here's a
breakdown of what it does: */
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/offer_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a new express application
const app = express();
app.use(bodyParser.json());
app.use(cors());

/**
 * The function `authenticateApiKey` is a middleware used for API key authentication in a Node.js
 * application.
 * @param req - The `req` parameter in the `authenticateApiKey` function stands for the request object.
 * It contains information about the HTTP request made to the server, including headers, parameters,
 * body, and more. In this case, the function is extracting the value of the `x-api-key` header from
 * the
 * @param res - The `res` parameter in the `authenticateApiKey` function stands for the response object
 * in Node.js. It is used to send a response back to the client making the request. In this case, the
 * function is checking for the presence and validity of an API key in the request headers, and if
 * @param next - The `next` parameter in the `authenticateApiKey` function is a callback function that
 * is used to pass control to the next middleware function in the request-response cycle. When called,
 * it tells Express to move on to the next middleware function in the chain. This allows you to chain
 * multiple middleware functions together
 * @returns In the provided code snippet, if the API key is not provided or is invalid, a response with
 * an error message and a status code of 401 (Unauthorized) is being returned. If the API key is valid,
 * the `next()` function is called to proceed to the next middleware or route handler in the
 * application.
 */
// Middleware for API key authentication
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      error: "No API key provided",
    });
  }

  // Check if API key is valid
  // Replace 'your_api_key' with your actual API key
  if (apiKey !== "aniruddhaqwerty1234") {
    return res.status(401).json({
      error: "Invalid API key",
    });
  }

  next();
}

/* The following code snippet is setting up health check endpoints for different components of the
application, namely Flask, Express, and MongoDB. These endpoints are used to verify the health
status of each component. */
// Health check endpoint for Flask
app.get("/api/v1/health/flask", async (req, res) => {
  try {
    // Make a request to the Flask health check endpoint
    const response = await axios.get("http://localhost:5000/api/v1/health");

    // Check if the Flask server is healthy
    if (response.data.message === "Flask server is running!") {
      res.status(200).json({
        message: "Flask server is healthy",
      });
    } else {
      res.status(500).json({
        error: "Flask server is not healthy",
      });
    }
  } catch (error) {
    console.error("Error while checking Flask server health:", error);
    res.status(500).json({
      error: "Error while checking Flask server health",
    });
  }
});

// Health check endpoint for Express
app.get("/api/v1/health/express", (req, res) => {
  // Check if the Express server is healthy
  res.status(200).json({
    message: "Express server is healthy",
  });
});

// Health check endpoint for MongoDB
app.get("/api/v1/health/mongodb", (req, res) => {
  // Check if the MongoDB connection is open
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({
      message: "MongoDB connection is open",
    });
  } else {
    res.status(500).json({
      error: "MongoDB connection is closed",
    });
  }
});
// Use the API key authentication middleware
app.use(authenticateApiKey);

app.use("/offer_db", offer_api);
app.use("/user_data", user_api);
app.use("/inquire_db", inquire_api);
app.use("/offer_coa_upload", offer_coa_upload_api);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
  });
});

// Start the Express server
app.listen(3000, () => console.log("Server is running on port 3000"));
