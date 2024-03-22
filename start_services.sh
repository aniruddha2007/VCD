#!/bin/bash

# Start Flask server
echo "Starting Flask server..."
cd backend/main-code
python3 main.py &
sleep 2

# Start Express server
echo "Starting Express server..."
cd ../admin
npm start &
sleep 2

# Start React server
echo "Starting React server..."
cd ../../frontend
npm start -- --port 3001
