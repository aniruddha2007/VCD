#Code to receive messages from whatsapp and store in respective collections of mongodb
from flask import Flask, request, send_file, Blueprint
import json
import pymongo
import re
import datetime
from communications.whatsapp_message import send_whatsapp_message
from functions.whatsapp_functions import convert_timestamp, is_offer_selection, is_offer_message, is_inquire_message
#Some functions moved to whatsapp_functions.py

# Create a Flask app
whatsapp_blueprint = Blueprint('blueprint', __name__)

# Connect to MongoDB for storing Whatsapp Data
client = pymongo.MongoClient("mongodb://localhost:27017/")
# Connect to MongoDB for storing general WhatsApp messages a catch all
db = client["messaging_data"]
whatsapp_collection = db["whatsapp_messages"]
# Connect to MongoDB for storing offer WhatsApp messages
offer_db = client["offer_db"]
offer_collection = offer_db["offer_messages"]
today_offer_collection = offer_db['today_offer_collection']
selected_offer_collection = offer_db["selected_offer_messages"]

# Connect to MongoDB for storing inquire WhatsApp messages
inquire_db = client["inquire_db"]
inquire_collection = inquire_db["inquire_messages"]
# Connect to MongoDB for storing user data
user_db = client["user_data"]
user_collection = user_db["users"]

#Whatsapp Webhook
# Combined WhatsApp Webhook and Verification Endpoint
@whatsapp_blueprint.route("/whatsapp_webhook", methods=["POST", "GET"])
def whatsapp_webhook():
    if request.method == "POST":
        # Handle incoming WhatsApp messages
        data = request.json
        handle_incoming_messages(data)
        return "", 200
    elif request.method == "GET":
        # Handle webhook verification
        # Define your verification token
        VERIFY_TOKEN = "aniruddha"

        # Parse the query parameters from the request
        mode = request.args.get("hub.mode")
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")

        # Check if a mode and token were sent
        if mode and token:
            # Check if the mode is 'subscribe' and the token matches your verification token
            if mode == "subscribe" and token == VERIFY_TOKEN:
                # Respond with the challenge token to complete the verification
                return challenge, 200
            else:
                # Respond with '403 Forbidden' if the token doesn't match
                return "Invalid verification token", 403
        else:
            # Respond with '400 Bad Request' if mode or token is missing
            return "Missing mode or token", 400

# Function to handle incoming messages
def handle_incoming_messages(data):
    for entry in data.get('entry', []):
        for change in entry.get('changes', []):
            if 'messages' in change.get('field', ''):
                message_data = change.get('value', {})
                for message in message_data.get('messages', []):
                    if message.get('type') == 'text':
                        text = message.get('text', {}).get('body', '')
                        sender = message.get('from')
                        print(f"Received message '{text}' from number '{sender}'")
                        timestamp_og = message.get('timestamp')
                        # Convert string timestamp to integer
                        timestamp_og_int = int(timestamp_og)
                        timestamp = convert_timestamp(timestamp_og_int)
                        user = find_or_create_user(sender, text)
                        handle_message(text, sender, timestamp, user)


# Function to handle different types of messages
def handle_message(text, sender, timestamp, user):
    if is_offer_selection(text):
        offer_selection_message(text, sender, timestamp)
    elif is_offer_message(text):
        store_offer_message(text, sender, timestamp, user)
    elif is_inquire_message(text):
        store_inquire_message(text, sender, timestamp, user)
    else:
        store_general_message(text, sender, timestamp, user)

# Function to handle offer selection message
def offer_selection_message(text, sender, timestamp):
    try:
        # Extract order number from the text
        match = is_offer_selection(text)
        if match:
            order_number = int(match.group(1))
            # Find the offer with the matching order number in today's offers
            selected_offer = today_offer_collection.find_one({"order": int(order_number)})
            if selected_offer:
                # Extract offer_id from the selected offer
                offer_id = selected_offer.get('offer_id')
                # Check if the offer already exists for the same sender and offer ID
                existing_offer = selected_offer_collection.find_one({
                    'sender': sender,
                    'offer_id': offer_id
                })
                if not existing_offer:
                    # Store the selected offer in the offer_collection
                    selected_offer_collection.insert_one({
                        'order': order_number,
                        'sender': sender,
                        'timestamp': timestamp,
                        'offer_id': offer_id
                    })
                    send_whatsapp_message(sender, f"Offer {order_number} selected successfully for user {sender}.")
                else:
                    send_whatsapp_message(sender, f"Offer {order_number} is already selected for user {sender}.")
            else:
                send_whatsapp_message(sender, "Selected offer not found. Please select a valid offer.")
        else:
            send_whatsapp_message(sender, "Invalid offer selection format. Please use 'select: <order_number>'.")
    except Exception as e:
        send_whatsapp_message(sender, "An error occurred while processing your offer selection. Please try again later.")


#Find or create user------Also add a line userid and match it to wa_id---------
def find_or_create_user(wa_id, text):
    # Check if the user exists in the database
    user = user_collection.find_one({'wa_id': wa_id})
    if user:
        return user
    else:
        # Determine the user category (buyer or seller) based on message content
        category = 'buyer' if 'buyer' in text.lower() else 'seller'
        # Create a new user document with the category
        user_collection.insert_one({'wa_id': wa_id, 'category': category})
        return user_collection.find_one({'wa_id': wa_id})

#Store offer message
def store_offer_message(text, sender, timestamp, user):
    # Extract offer details from the text
    match = is_offer_message(text)
    if match:
        min_gar = match.group(1) # Extract min GAR
        max_gar = match.group(2) # Extract max GAR
        min_ash = match.group(3) # Extract min Ash
        max_ash = match.group(4) # Extract max Ash
        volume = match.group(5) # Extract volume
        laycan = match.group(6).strip()  # Laycan part
        port = match.group(7).strip()  # Port part
        # Store offer message with user information
        offer_collection.insert_one({
            'sender': sender,
            'timestamp': timestamp,
            'user': user,
            'min_gar': min_gar,
            'max_gar': max_gar,
            'min_ash': min_ash,
            'max_ash': max_ash,
            'volume': volume,
            'laycan': laycan,
            'port': port
        })

#Store inquire message
def store_inquire_message(text, sender, timestamp, user):
    # Extract inquire details from the text
    match = is_inquire_message(text)
    if match:
        min_gar = match.group(1) # Extract min GAR
        max_gar = match.group(2) # Extract max GAR
        min_ash = match.group(3) # Extract min Ash
        max_ash = match.group(4) # Extract max Ash
        volume = match.group(5) # Extract volume
        laycan = match.group(6).strip()  # Laycan part
        port = match.group(7).strip()  # Port part
        # Store inquire message with user information
        inquire_collection.insert_one({
            'sender': sender,
            'timestamp': timestamp,
            'user': user,
            'min_gar': min_gar,
            'max_gar': max_gar,
            'min_ash': min_ash,
            'max_ash': max_ash,
            'volume': volume,
            'laycan': laycan,
            'port': port
        })

# Store general message Catch all function
def store_general_message(text, sender, timestamp, user):
    # Store general message with user information
    whatsapp_collection.insert_one({
        'sender': sender,
        'timestamp': timestamp,
        'user': user,
        'text': text
    })
