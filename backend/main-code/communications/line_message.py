import requests
import json
import pymongo

#Database
client = pymongo.MongoClient("mongodb://localhost:27017/")
user_db = client["user_data"]
user_collection = user_db["users"]

CHANNEL_ACCESS_TOKEN = 'wQRsF0ucWe3yo8Cme5+Plj6yFIegLEXC9D5DI0COnkRd0bThx+hHYVC+ESkRsj3SDkEEi9j+wL+/iDXc4XWhaJ0t535Jdk3pvKG28B9RdFxHLMUoHUYYFR7EDt3Nr2kj1wp5gfZRiSN+np+EU3VpbgdB04t89/1O/w1cDnyilFU='

def send_line_image(user_id, image_url):
    url = "https://api.line.me/v2/bot/message/push"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CHANNEL_ACCESS_TOKEN}"
    }

    payload = {
        "to": user_id,
        "messages": [
            {
                "type": "image",
                "originalContentUrl": image_url,
                "previewImageUrl": image_url
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        if response.status_code == 200:
            print("Line message sent successfully to user:", user_id)
        else:
            print("Failed to send Line message. Response:", response_data)
    except Exception as e:
        print("An error occurred while sending Line message:", str(e))
        return None

def send_line_message(user_id, message):
    url = "https://api.line.me/v2/bot/message/push"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CHANNEL_ACCESS_TOKEN}"
    }

    payload = {
        "to": user_id,
        "messages": [
            {
                "type": "text",
                "text": message
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        if response.status_code == 200:
            print("Line message sent successfully to user:", user_id)
        else:
            print("Failed to send Line message. Response:", response_data)
    except Exception as e:
        print("An error occurred while sending Line message:", str(e))
        return None

def get_buyer_user_ids():
    try:
        # Query the database
        buyers = user_collection.find({"category": "buyer"}, {"userId": 1})
        buyer_user_ids = [buyer["userId"] for buyer in buyers if "userId" in buyer]
        print("Buyer user IDs:", buyer_user_ids)
        
        # Print all the data found
        for buyer in buyers:
            print("Buyer data:", buyer)
        
        return buyer_user_ids
    except KeyError:
        print("Error: 'userId' field not found in some documents.")
        return []


def get_seller_user_ids():
    try:
        # Query the database
        sellers = user_collection.find({"category": "seller"}, {"userId": 1})
        seller_user_ids = [seller["userId"] for seller in sellers if "userId" in seller]
        print("Seller user IDs:", seller_user_ids)
        
        # Print all the data found
        for seller in sellers:
            print("Seller data:", seller)
        
        return seller_user_ids
    except KeyError:
        print("Error: 'userId' field not found in some documents.")
        return []

