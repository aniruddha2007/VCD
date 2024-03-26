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

- **Endpoint**: `/get-offers-with-coa`
- **Method**: GET
- **Purpose**: Fetches all offers with a Certificate of Analysis (COA).
- **Returns**: An array of offers with a COA or an error message.

- **Endpoint**: `/get-offers-without-coa`
- **Method**: GET
- **Purpose**: Fetches all offers without a Certificate of Analysis (COA).
- **Returns**: An array of offers without a COA or an error message.

#### User Management Routes

- **Create User Endpoint**:

  - **Endpoint**: `/users/create`
  - **Method**: POST
  - **Purpose**: Creates a new user with the provided data.
  - **Body Parameters**:
    - `new_user`: An object containing the new user's data.
    - `Sample Data for Line Users`:
      ```json
      {
        "userId": "U9b8eda58f783af236e2d583b85471290",
        "category": "buyer"
      }
      ```
    - `Sample Data for Whatsapp Users`:
      ```json
      {
        "wa_id": "919655660060",
        "category": "seller"
      }
      ```
  - **Returns**: JSON containing the newly created user's ID or an error message.

- **Read Users Endpoint**:

  - **Endpoint**: `/users/read`
  - **Method**: GET
  - **Purpose**: Retrieves a list of all users.
  - **Returns**: An array of users or an error message.

- **Update User Endpoint**:

  - **Endpoint**: `/users/update/:id`
  - **Method**: PUT
  - **Purpose**: Updates an existing user's data based on their ID.
  - **Parameters**:
    - `id`: The unique identifier for the user to be updated.
  - **Body Parameters**:
    - `updated_user`: An object containing the updated user's data.
  - **Returns**: JSON containing the updated user's data or an error message.

- **Delete User Endpoint**:
  - **Endpoint**: `/users/delete/:id`
  - **Method**: DELETE
  - **Purpose**: Deletes a user based on their ID.
  - **Parameters**:
    - `id`: The unique identifier for the user to be deleted.
  - **Returns**: JSON containing the deleted user's data or an error message.

### Models

#### Offer Model (`offer_model.js`)

- **Purpose**: Defines a schema for offers including sender details, timestamp, user information, country, and related PDF data.
- **Fields**:
  - `sender`: The sender's identification.
  - `timestamp`: The time when the offer was created or sent.
  - `user`: An object containing the user's ID and category.
  - `userId`: The user's unique identifier.
  - `category`: The user's category (e.g., admin, buyer, seller).
  - `country`: The country of origin for the offer.
  - `mine_name`: The name of the mine.
  - `typical_gar`: The typical Gross As Received (GAR) value.
  - `typical_ash`: The typical Ash value.
  - `typical_sulphur`: The typical Sulphur value.
  - `volume`: The volume of the offer.
  - `laycan`: The laycan date.
  - `port`: The port of origin.
  - `status`: The status of the offer.
  - `pdf`: Stores PDF data as a Buffer.

#### CRUD Operations for Offers (`offer_restful_api.js`)

- **Overview**: Detailed explanation of Create, Read, Update, and Delete operations for offers, utilizing MongoDB.

- **Create Offer**:

  - **Endpoint**: `/offers/create`
  - **Method**: POST
  - **Purpose**: Creates a new offer based on the provided data.
  - **Parameters**:
    - `new_offer`: An object containing the new offer's data.
    - `pdf`: The PDF file to be uploaded.
    - `Sample Data`:
      ```json
      {
        "sender": "admin",
        "timestamp": "2024-03-25 10:31:35",
        "user": {
          "userId": "ADMIN",
          "category": "admin"
        },
        "country": "Russia",
        "mine_name": "Elga HCC Select",
        "typical_gar": "6200",
        "typical_ash": "16",
        "typical_sulphur": "NaN",
        "volume": "NaN",
        "laycan": "NaN",
        "port": "Vanino/ Vostochny",
        "status": "NaN",
        "pdf": "PDF data in base64 format"
      }
      ```
  - **Returns**: The newly created offer's ID or an error message.

- **Read Offers**:

  - **Endpoint**: `/offers/read`
  - **Method**: GET
  - **Purpose**: Retrieves a list of all offers.
  - **Returns**: An array of offers or an error message.

- **Update Offer**:

  - **Endpoint**: `/offers/update/:id`
  - **Method**: PUT
  - **Purpose**: Updates an existing offer's data based on its ID.
  - **Parameters**:
    - `id`: The unique identifier for the offer to be updated.
    - `updated_offer`: An object containing the updated offer's data.
  - **Returns**: The updated offer's data or an error message.

- **Delete Offer**:

  - **Endpoint**: `/offers/delete/:id`
  - **Method**: DELETE
  - **Purpose**: Deletes an offer based on its ID.
  - **Parameters**:
    - `id`: The unique identifier for the offer to be deleted.
  - **Returns**: The deleted offer's data or an error message.

#### CRUD Operations for Inquires (`inquire_restful_api.js`)

- **Overview**: Detailed explanation of Create, Read, Update, and Deleteoperations for inquires, utilizing MongoDB.

- **Create Inquire**:

- **Endpoint**: `/inquires/create`
- **Method**: POST
- **Purpose**: Creates a new inquire based on the provided data.
- **Parameters**:
- `new_inquire`: An object containing the new inquire's data.
- `Sample Data`:

```json
{
  "sender": "admin",
  "timestamp": "2024-03-25 10:31:35",
  "user": {
    "userId": "ADMIN",
    "category": "admin"
  },
  "country": "Russia",
  "mine_name": "Elga HCC Select",
  "typical_gar": "6200",
  "typical_ash": "16",
  "typical_sulphur": "NaN",
  "volume": "NaN",
  "laycan": "NaN",
  "port": "Vanino/ Vostochny",
  "status": "NaN",
  "pdf": "PDF data in base64 format"
}
```

- **Returns**: The newly created inquire's ID or an error message.

- **Read Inquires**:
- **Endpoint**: `/inquires/read`
- **Method**: GET
- **Purpose**: Retrieves a list of all inquires.
- **Returns**: An array of inquires or an error message.

- **Update Inquire**:

- **Endpoint**: `/inquires/update/:id`
- **Method**: PUT
- **Purpose**: Updates an existing inquire's data based on its ID.
- **Parameters**:
- `id`: The unique identifier for the inquire to be updated.
- `updated_inquire`: An object containing the updated inquire's data.
- **Returns**: The updated inquire's data or an error message.

- **Delete Inquire**:
- **Endpoint**: `/inquires/delete/:id`
- **Method**: DELETE
- **Purpose**: Deletes an inquire based on its ID.
- **Parameters**:
- `id`: The unique identifier for the inquire to be deleted.
- **Returns**: The deleted inquire's data or an error message.

### Additional Notes

This code requires MongoDB to be installed and running on `localhost:27017`. Node.js and necessary NPM packages (`express`, `mongoose`, `multer`, `mongodb`) must also be installed.
