import requests

# Ngrok URL (replace this with your actual ngrok URL)
NGROK_URL = "https://f111-2001-b011-4008-31b9-d0ce-da88-1197-89fc.ngrok-free.app/"

# Replace YOUR_CHANNEL_ACCESS_TOKEN with your actual Line channel access token
CHANNEL_ACCESS_TOKEN = 'wQRsF0ucWe3yo8Cme5+Plj6yFIegLEXC9D5DI0COnkRd0bThx+hHYVC+ESkRsj3SDkEEi9j+wL+/iDXc4XWhaJ0t535Jdk3pvKG28B9RdFxHLMUoHUYYFR7EDt3Nr2kj1wp5gfZRiSN+np+EU3VpbgdB04t89/1O/w1cDnyilFU='

def sent_line_message():
    payload = request.json

    if 'events' in payload and len(payload['events']) > 0:
        event_type = payload['events'][0]['type']

        if event_type == 'message':
            handle_message_event(payload)

    return jsonify({'success': True})

def handle_message_event(payload):
    message = payload['events'][0]['message']['text']
    reply_token = payload['events'][0]['replyToken']

    if message.lower() == 'send image':
        send_image_message(reply_token)

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
    response = requests.post('https://api.line.me/v2/bot/message/broadcast', json=data, headers=headers)
    print("Broadcast response:", response.json())  # Print response for debugging
