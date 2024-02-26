from flask import Flask, request, jsonify, send_file
import requests
from apscheduler.schedulers.background import BackgroundScheduler
from line import send_broadcast_image, NGROK_URL, CHANNEL_ACCESS_TOKEN, sent_line_message
from test_email import send_email
from whatsapp import send_whatsapp_image

app = Flask(__name__)

TIMEZONE = 'Asia/Taipei'

scheduler = BackgroundScheduler()


#variables for whatsapp
phone_number = "919657060060"

#variables for email
recipient_email = "ani@pakoindia.com"
subject = "Today's Coal Offers from Virtuit"
html_content = """
<html>
<body>
    <h2>Today's Offer</h2>
    <p>Dear Recipient,</p>
    <p>We hope this email finds you well.</p>
    <p>Here are the coal offers for today. For more details, please contact us.</p>
    <p>Best regards,<br>Virtuit Co., Ltd Team</p>
</body>
</html>
"""

@app.route('/webhook', methods=['POST'])
def webhook():
    sent_line_message()
    return "This is the Line webhook endpoint."

def scheduled_task():
    # Scheduled task to trigger broadcasting of image message
    image_url = f"{NGROK_URL}image.png"
    send_email(subject,recipient_email,html_content,"uploads/table_image.png")
    #send_broadcast_image(image_url)
    #send_whatsapp_image(phone_number, image_url)

@app.route('/image.png')
def serve_image():
    image_path = "uploads/table_image.png"  # Update with the correct file path
    return send_file(image_path, mimetype='image/png')

@app.route('/test_broadcast_image', methods=['GET'])
def test_broadcast_image():
    # Endpoint to trigger broadcasting of image message for testing
    image_url = f"{NGROK_URL}/image.png"
    send_broadcast_image(image_url)
    return "Image broadcast triggered successfully."

@app.route('/whatsapp', methods=['POST'])
def whatsapp():
    return "This is the WhatsApp endpoint."

if __name__ == '__main__':
    # Schedule the task to run every day at ____ using cron expression
    scheduler.add_job(scheduled_task, 'cron', hour=11, minute=4, second=40, timezone=TIMEZONE)
    scheduler.start()
    app.run(debug=True)