import requests
from flask import Flask, request, Blueprint
import pymongo
import re
import datetime
from communications.line_message import send_line_message

# Create a Flask app
line_blueprint = Blueprint('blueprint', __name__)

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["messaging_data"]
line_collection = db["line_messages"]
user_db = client["user_data"]
user_collection = user_db["users"]
offer_db = client["offer_db"]
offer_collection = offer_db["offer_messages"]
today_offer_collection = offer_db['today_offer_collection']
selected_offer_collection = offer_db["selected_offer_messages"]
inquire_db = client["inquire_db"]
inquire_collection = inquire_db["inquire_messages"]

# Check if the message is an offer message
def is_offer_message(text):
    pattern = r"offer: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+)"
    return re.match(pattern, text)

# Check if the message is an inquire message
def is_inquire_message(text):
    pattern = r"inquire: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+)"
    return re.match(pattern, text)

def is_offer_selection_message(text):
    return text.startswith('select: ')

# Store line data
def store_line_data(text, user_id, timestamp):

    if is_offer_message(text) or is_inquire_message(text):
        return

    message_data = {
        "text": text,
        "user_id": user_id,
        "timestamp": timestamp
    }
    line_collection.insert_one(message_data)
    print(f"Message stored in line_messages: {text} from user: {user_id}")

# Find or create user
def find_or_create_user(user_id, text):
    user = user_collection.find_one({'userId': user_id})
    if not user:
        category = 'buyer' if 'buyer' in text.lower() else 'seller'
        user_collection.insert_one({'userId': user_id, 'category': category})

# Store offer message
def store_offer_message(text, user_id, timestamp):
    match = is_offer_message(text)
    if match:
        min_gar = match.group(1)
        max_gar = match.group(2)
        min_ash = match.group(3)
        max_ash = match.group(4)
        volume = match.group(5)
        laycan = match.group(6).strip()
        port = match.group(7).strip()
        offer_data = {
            'user_id': user_id,
            'timestamp': timestamp,
            'min_gar': min_gar,
            'max_gar': max_gar,
            'min_ash': min_ash,
            'max_ash': max_ash,
            'volume': volume,
            'laycan': laycan,
            'port': port
        }
        offer_collection.insert_one(offer_data)

# Store inquire message
def store_inquire_message(text, user_id, timestamp):
    match = is_inquire_message(text)
    if match:
        min_gar = match.group(1)
        max_gar = match.group(2)
        min_ash = match.group(3)
        max_ash = match.group(4)
        volume = match.group(5)
        laycan = match.group(6).strip()
        port = match.group(7).strip()
        inquire_data = {
            'user_id': user_id,
            'timestamp': timestamp,
            'min_gar': min_gar,
            'max_gar': max_gar,
            'min_ash': min_ash,
            'max_ash': max_ash,
            'volume': volume,
            'laycan': laycan,
            'port': port
        }
        inquire_collection.insert_one(inquire_data)

# Webhook for Line
@line_blueprint.route('/line_webhook', methods=['POST'])
def line_webhook():
    data = request.json
    events = data.get('events', [])
    for event in events:
        message = event.get('message', {})
        text = message.get('text', '')
        user_id = event.get('source', {}).get('userId', '')
        timestamp_og = event.get('timestamp', '')
        timestamp_og_int = int(timestamp_og) / 1000
        timestamp = convert_timestamp(timestamp_og_int)
        print(f"Received message: {text} from user: {user_id}")

        # Find or create user
        find_or_create_user(user_id, text)
        print(f"User {user_id} processed.")

        # Check if the message is an offer or inquiry
        if is_offer_message(text):
            store_offer_message(text, user_id, timestamp)
            print(f"Offer message stored for user: {user_id}")
        elif is_inquire_message(text):
            store_inquire_message(text, user_id, timestamp)
            print(f"Inquiry message stored for user: {user_id}")
        elif is_offer_selection_message(text):
            offer_selection_message(text, user_id, timestamp)
            print(f"Offer selection message processed for user: {user_id}")
        else:
            # Store line data only if it's not an offer or inquiry
            store_line_data(text, user_id, timestamp)
            print(f"Line message stored for user: {user_id}")

    return '', 200

# Function to convert timestamp
def convert_timestamp(timestamp_og_int):
    dt_object = datetime.datetime.fromtimestamp(timestamp_og_int)
    # Format datetime object as a readable date and time
    readable_date_time = dt_object.strftime('%Y-%m-%d %H:%M:%S')
    return readable_date_time

# Function to handle offer selection message
def offer_selection_message(text, user_id, timestamp):
    try:
        match = re.match(r"select: (\d+)", text)
        if match:
            order_number = int(match.group(1))
            # Find the offer with the matching order number in today's offers
            selected_offer = today_offer_collection.find_one({"order": int(order_number)})
            if selected_offer:
                offer_id = selected_offer.get('offer_id')
                existing_offer = selected_offer_collection.find_one({
                    'user_id': user_id,
                    'offer_id': offer_id
                })
                if not existing_offer:
                    # Store the selected offer in the selected_offer_collection
                    selected_offer_collection.insert_one({
                        'order': order_number,
                        'user_id': user_id,
                        'timestamp': timestamp,
                        'offer_id': offer_id
                    })
                    # Inform the user about the successful selection via Line
                    send_line_message(user_id, f"Offer {order_number} selected successfully for user {user_id}.")
                else:
                    # Inform the user that the offer has already been selected
                    send_line_message(user_id, f"Offer {order_number} is already selected for user {user_id}.")
            else:
                # Inform the user that the selected offer was not found
                send_line_message(user_id, "Selected offer not found. Please select a valid offer.")
        else:
            # Inform the user about the invalid format of the selection message
            send_line_message(user_id, "Invalid offer selection format. Please use 'select: <order_number>'.")
    except Exception as e:
        # Inform the user about an error during offer selection processing
        send_line_message(user_id, "An error occurred while processing your offer selection. Please try again later.")
