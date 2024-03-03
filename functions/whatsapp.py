
# Function to send a WhatsApp image message
# import requests
# import json
# from flask import Flask, request

# access_token = "EAAEzvLRXAZCEBOwOZC8d4LXwIoJaId2qxq9PyIHaG2gLBXx3WYfNMcYOCJ6z9wMeLevK0Q8Ufz3vBfey3fgYvc5YH5e5bJIxxrADU42efndKOpxI79F1w5DlUJnk5CFoIpEoQP4JYDuqnB1mI9L431NXbYe4aK01zJ9UJZAiRjYC1XwrnNhCEt3QUnwyk7qJk2d0elrW7ek3P39GyX2qyF1vwzneXCE594ZD"

# from_phone_number_id = "243106965553162"

# def send_whatsapp_image(phone_number, image_url):
#     url = f"https://graph.facebook.com/v19.0/{from_phone_number_id}/messages"

#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "messaging_product": "whatsapp",
#         "recipient_type": "individual",
#         "to": phone_number,
#         "type": "image",
#         "image": {
#             "link": image_url
#         }
#     }

#     response = requests.post(url, headers=headers, data=json.dumps(payload))

#     return response.json()

from flask import Flask, request, send_file
import json
import pymongo
import re

app = Flask(__name__)

# Connect to MongoDB for storing general WhatsApp messages
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["messaging_data"]
whatsapp_collection = db["whatsapp_messages"]

# Connect to MongoDB for storing offer WhatsApp messages
offer_client = pymongo.MongoClient("mongodb://localhost:27017/")
offer_db = offer_client["offer_db"]
offer_collection = offer_db["offer_messages"]

# Connect to MongoDB for storing inquire WhatsApp messages
inquire_client = pymongo.MongoClient("mongodb://localhost:27017/")
inquire_db = inquire_client["inquire_db"]
inquire_collection = inquire_db["inquire_messages"]

# Connect to MongoDB for storing user data
user_db = client["user_data"]
user_collection = user_db["users"]

# Set your verification token
VERIFY_TOKEN = "aniruddha"

@app.route('/whatsapp_webhook', methods=['POST'])
def whatsapp_webhook():
    data = request.json
    store_whatsapp_data(data)
    return '', 200

#host image, image path:/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/functions/main.py
@app.route('/image', methods=['GET','POST'])
def image():
    return send_file('/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/functions/offer_table.png', mimetype='image/png')


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

def is_offer_message(text):
    # Check if the text matches the offer message pattern
    pattern = r"offer: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+)"
    return re.match(pattern, text)

def is_inquire_message(text):
    # Check if the text matches the inquire message pattern
    pattern = r"inquire: GAR (\d+)-(\d+) Ash (\d+)-(\d+) Volume (\d+) Laycan \((.*?)\) Port (\w+)"

    return re.match(pattern, text)

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

def store_offer_message(text, sender, timestamp, user):
    # Extract offer details from the text
    match = is_offer_message(text)
    if match:
        min_gar = match.group(1)
        max_gar = match.group(2)
        min_ash = match.group(3)
        max_ash = match.group(4)
        volume = match.group(5)
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

def store_inquire_message(text, sender, timestamp, user):
    # Extract inquire details from the text
    match = is_inquire_message(text)
    if match:
        min_gar = match.group(1)
        max_gar = match.group(2)
        min_ash = match.group(3)
        max_ash = match.group(4)
        volume = match.group(5)
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

def store_general_message(text, sender, timestamp, user):
    # Store general message with user information
    whatsapp_collection.insert_one({
        'sender': sender,
        'timestamp': timestamp,
        'user': user,
        'text': text
    })

if __name__ == '__main__':
    app.run(debug=True)
