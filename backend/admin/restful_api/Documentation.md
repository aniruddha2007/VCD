## Documentation.md

### Introduction

This documentation covers the functionalities, classes, and RESTful API routes provided in the JavaScript code. The code is structured into multiple facets - handling PDF file fetching, user management, and a model definition for Offers with their respective CRUD operations.

### Modules and Libraries

- **Express.js**: A web application framework for Node.js, used for server setup and API route definition.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, used for schema definition and database interaction.
- **MongoDB**: A NoSQL database, used for storing user data and offers information.
- **Multer**: A middleware for handling `multipart/form-data`, used for uploading files.

### API Routes

#### PDF Fetch Route

- **Endpoint**: `/pdf/:id`
- **Method**: GET
- **Purpose**: Fetches a specific PDF file based on its ID.
- **Parameters**:
  - `id`: The unique identifier for the PDF file to be fetched.
- **Returns**: The PDF file as a response if found, otherwise returns an error message.

#### User Management Routes

- **Create User Endpoint**: 
  - **Endpoint**: `/users/create`
  - **Method**: POST
  - **Purpose**: Creates a new user with the provided data.
  - **Body Parameters**: 
    - `new_user`: An object containing the new user's data.
  - **Returns**: JSON containing the newly created user's ID or an error message.
  
- **Read Users Endpoint**:
  - **Endpoint**: `/users/read`
  - **Method**: GET
  - **Purpose**: Retrieves a list of all users.
  - **Returns**: An array of users or an error message.

### Models

#### Offer Model (`offer_model.js`)

- **Purpose**: Defines a schema for offers including sender details, timestamp, user information, country, and related PDF data.
- **Fields**:
  - `sender`: The sender's identification.
  - `timestamp`: The time when the offer was created or sent.
  - `user`: An object containing the user's ID and category.
  - `country`: The country of origin for the offer.
  - `pdf`: Stores PDF data as a Buffer.
  
#### CRUD Operations

- **Overview**: Detailed explanation of Create, Read, Update, and Delete operations for offers, utilizing MongoDB.

### Additional Notes

This code requires MongoDB to be installed and running on `localhost:27017`. Node.js and necessary NPM packages (`express`, `mongoose`, `multer`, `mongodb`) must also be installed.
