
# Function to send a WhatsApp image message
import requests
import json

access_token = "EAAEzvLRXAZCEBOwOZC8d4LXwIoJaId2qxq9PyIHaG2gLBXx3WYfNMcYOCJ6z9wMeLevK0Q8Ufz3vBfey3fgYvc5YH5e5bJIxxrADU42efndKOpxI79F1w5DlUJnk5CFoIpEoQP4JYDuqnB1mI9L431NXbYe4aK01zJ9UJZAiRjYC1XwrnNhCEt3QUnwyk7qJk2d0elrW7ek3P39GyX2qyF1vwzneXCE594ZD"

from_phone_number_id = "243106965553162"

def send_whatsapp_image(phone_number, image_url):
    url = f"https://graph.facebook.com/v19.0/{from_phone_number_id}/messages"

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

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    return response.json()