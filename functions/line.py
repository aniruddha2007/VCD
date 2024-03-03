import requests
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Ngrok URL (replace this with your actual ngrok URL)
NGROK_URL = "https://bdf5-2001-b011-4008-1c8f-743f-6430-ddd7-f996.ngrok-free.app/"

# Replace YOUR_CHANNEL_ACCESS_TOKEN with your actual Line channel access token
CHANNEL_ACCESS_TOKEN = 'wQRsF0ucWe3yo8Cme5+Plj6yFIegLEXC9D5DI0COnkRd0bThx+hHYVC+ESkRsj3SDkEEi9j+wL+/iDXc4XWhaJ0t535Jdk3pvKG28B9RdFxHLMUoHUYYFR7EDt3Nr2kj1wp5gfZRiSN+np+EU3VpbgdB04t89/1O/w1cDnyilFU='

UPLOAD_FOLDER = 'uploads'  # Folder to save downloaded images
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Specify the user ID allowed to send images
ALLOWED_USER_ID = 'U9b8eda58f783af596e2d583b85471290'

def sent_line_message():
    payload = request.json

    if 'events' in payload and len(payload['events']) > 0:
        events = payload['events']

        for event in events:
            if event['type'] == 'message' and event['message']['type'] == 'image':
                handle_image_message(event)
            else:
                handle_message_event(event)

    return jsonify({'success': True})


def handle_message_event(event):
    # Extract user ID from the event
    user_id = event['source'].get('userId', None)
    if user_id == ALLOWED_USER_ID:
        message = event['message']['text']
        reply_token = event['replyToken']

        if message.lower() == 'send image':
            send_image_message(reply_token)
    else:
        print(f"Unauthorized user: {user_id}")


def handle_image_message(event):
    # Extract image information
    image_id = event['message']['id']
    content_provider_type = event['message']['contentProvider']['type']
    original_content_url = event['message']['contentProvider'].get('originalContentUrl', None)

    # Print image information
    print("Image ID:", image_id)
    print("Content Provider Type:", content_provider_type)

    # Download the image if the original content URL is not provided
    if not original_content_url:
        download_image_from_line(image_id)

    # Example: Send response message
    reply_token = event['replyToken']
    reply_message(reply_token, "Image received.")


def download_image_from_line(image_id):
    url = f"https://api-data.line.me/v2/bot/message/{image_id}/content"
    response = requests.get(url, headers={'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}'})
    if response.status_code == 200:
        filename = f"table_image.png"  # You can adjust the filename if needed
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Image downloaded: {filepath}")
    else:
        print(f"Failed to download image from Line server. Status code: {response.status_code}")


def send_image_message(reply_token):
    image_url = f"{NGROK_URL}/image.png"
    send_broadcast_image(image_url)


def send_broadcast_image(image_url):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}'
    }
    data = {
        'messages': [{
            'type': 'image',
            'originalContentUrl': image_url,
            'previewImageUrl': image_url
        }],
        'notificationDisabled': False
    }


def reply_message(reply_token, message):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}'
    }
    data = {
        'replyToken': reply_token,
        'messages': [{'type': 'text', 'text': message}]
    }

    response = requests.post('https://api.line.me/v2/bot/message/broadcast', json=data, headers=headers)
    print("Broadcast response:", response.json())  # Print response for debugging


if __name__ == '__main__':
    app.run(debug=True)
