
#Function to send a WhatsApp image message
import requests
import json
import pymongo

#Database
client = pymongo.MongoClient("mongodb://localhost:27017/")
user_db = client["user_data"]
user_collection = user_db["users"]

#send whatsapp image
def send_whatsapp_image(phone_number, image_url):
    from_phone_number_id = "264895430037819"
    url = f"https://graph.facebook.com/v19.0/{from_phone_number_id}/messages"
    access_token = "EAAFiaqaNBdcBO5fw75rvTe9RNfcoSxAeBr8CbU9v63IawIBOr6XPW6YSXcx75as2zNzH563OGahoikF0JKQ0yY84BrlC8XJoZAVps10CnXZC7iCaKrkpU9D3W6QpNZCUh2OLrbCVPDqt2TELxKLZAz2UaZCr6jNzGNB61hZAQNvU10xarasZAVA2A3y6Vc9G0EMAcvj5QJM1ZAm3UTBcX24QYvqMZBMsZD"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "image",
        "image": {
            "link": image_url
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response_data = response.json()
        if response.status_code == 200:
            print("WhatsApp image message sent successfully to:", phone_number)
        else:
            print("Failed to send WhatsApp image message. Response:", response_data)
    except Exception as e:
        print("An error occurred while sending WhatsApp image message:", str(e))
        return None

#send whatsapp message
def send_whatsapp_message(phone_number, message):
    from_phone_number_id = "264895430037819"
    url = f"https://graph.facebook.com/v19.0/{from_phone_number_id}/messages"
    access_token = "EAAFiaqaNBdcBO5fw75rvTe9RNfcoSxAeBr8CbU9v63IawIBOr6XPW6YSXcx75as2zNzH563OGahoikF0JKQ0yY84BrlC8XJoZAVps10CnXZC7iCaKrkpU9D3W6QpNZCUh2OLrbCVPDqt2TELxKLZAz2UaZCr6jNzGNB61hZAQNvU10xarasZAVA2A3y6Vc9G0EMAcvj5QJM1ZAm3UTBcX24QYvqMZBMsZD"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response_data = response.json()
        if response.status_code == 200:
            print("WhatsApp message sent successfully to:", phone_number)
        else:
            print("Failed to send WhatsApp message. Response:", response_data)
    except Exception as e:
        print("An error occurred while sending WhatsApp message:", str(e))
        return None

#Get buyer phone number
def get_buyer_phone_number():
    try:
        # Query database
        buyers = user_collection.find({"category": "buyer"}, {"wa_id": 1})
        buyer_phone_numbers = [buyer.get("wa_id") for buyer in buyers if buyer.get("wa_id") is not None]
        print("Buyer phone numbers:", buyer_phone_numbers)
        return buyer_phone_numbers
    except Exception as e:
        print("An error occurred while fetching buyer phone numbers:", str(e))
        return []

#Get seller phone number
def get_seller_phone_number():
    try:
        # Query database
        sellers = user_collection.find({"category": "seller"}, {"wa_id": 1})
        seller_phone_numbers = [seller.get("wa_id") for seller in sellers if seller.get("wa_id") is not None]
        print("Seller phone numbers:", seller_phone_numbers)
        return seller_phone_numbers
    except Exception as e:
        print("An error occurred while fetching seller phone numbers:", str(e))
        return []
