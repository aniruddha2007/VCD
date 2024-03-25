```markdown
# Node.js Backend Server

This Node.js application serves as a backend server for managing various functionalities through RESTful APIs. It includes endpoints for offers, user data, inquiries, and offer COA uploads. The application is connected to a MongoDB database for data storage and utilizes Axios for making HTTP requests, Mongoose for MongoDB interaction, and CORS for enabling cross-origin resource sharing.

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   npm start
   ```

4. Ensure MongoDB is running locally on port `27017`.

## Usage

- The server runs on port `3000` by default.
- Use API endpoints to perform CRUD operations for offers, user data, inquiries, and offer COA uploads.
- Ensure to provide the correct API key in the `x-api-key` header for authentication.

## API Key Authentication

- API key authentication middleware (`authenticateApiKey`) ensures that requests are authenticated before proceeding to the respective endpoints. Unauthorized requests receive a 401 status response.

## Health Check Endpoints

- Health check endpoints are available to verify the status of the Flask server, Express server, and MongoDB connection.

## Error Handling

- The application includes an error handling middleware that catches and logs errors, responding with a 500 status for internal server errors.
```
