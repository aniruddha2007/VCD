#Code to receive messages from whatsapp and store in respective collections of mongodb
from flask import Flask, request, send_file
import json
import pymongo
import re

# Create a Flask app
app = Flask(__name__)

# Connect to MongoDB for storing Whatsapp Data
client = pymongo.MongoClient("mongodb://localhost:27017/")
# Connect to MongoDB for storing general WhatsApp messages a catch all
db = client["messaging_data"]
whatsapp_collection = db["whatsapp_messages"]
# Connect to MongoDB for storing offer WhatsApp messages
offer_db = client["offer_db"]
offer_collection = offer_db["offer_messages"]
# Connect to MongoDB for storing inquire WhatsApp messages
inquire_db = client["inquire_db"]
inquire_collection = inquire_db["inquire_messages"]
# Connect to MongoDB for storing user data
user_db = client["user_data"]
user_collection = user_db["users"]

# Set your verification token
VERIFY_TOKEN = "aniruddha"

#Whatsapp Webhook
@app.route('/whatsapp_webhook', methods=['POST'])
def whatsapp_webhook():
    data = request.json
    store_whatsapp_data(data)
    return '', 200

#Functions
#Store Whatsapp Data
def store_whatsapp_data(data):
    # Extract relevant fields and store in database
    for entry in data.get('entry', []):
        for change in entry.get('changes', []):
            if 'messages' in change.get('field', ''):
                message_data = change.get('value', {})
                for message in message_data.get('messages', []):
                    if message.get('type') == 'text':
                        text = message.get('text', {}).get('body', '')
                        sender = message.get('from')
                        timestamp = message.get('timestamp')
                        user = find_or_create_user(sender, text)
                        if is_offer_message(text):
                            store_offer_message(text, sender, timestamp, user)
                        elif is_inquire_message(text):
                            store_inquire_message(text, sender, timestamp, user)
                        else:
                            store_general_message(text, sender, timestamp, user)

#Check if the message is an offer message
def is_offer_message(text):
    # Check if the text matches the offer message pattern
    pattern = r"offer: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+)"
    return re.match(pattern, text)

#Check if the message is an inquire message
def is_inquire_message(text):
    # Check if the text matches the inquire message pattern
    pattern = r"inquire: GAR (\d+)-(\d+) Ash (\d+)-(\d+) Volume (\d+) Laycan \((.*?)\) Port (\w+)"
    return re.match(pattern, text)

# re pattern template for offer/inquire message is "offer/inquire: GAR___ Ash___ Volume___ Laycan (___) Port___"

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

#Store general message Catch all function
def store_general_message(text, sender, timestamp, user):
    # Store general message with user information
    whatsapp_collection.insert_one({
        'sender': sender,
        'timestamp': timestamp,
        'user': user,
        'text': text
    })
