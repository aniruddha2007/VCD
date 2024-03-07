from flask import Flask, send_file
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone
import matplotlib
matplotlib.use('Agg')
import pymongo

# Import Blueprints and generate functions
from webhooks.whatsapp_webhook import whatsapp_blueprint
from webhooks.line_webhook import line_blueprint
from functions.inquire_create import generate_inquiry_table
from functions.offer_create import generate_offer_table

#Import Send messages function
from communications.whatsapp_message import send_whatsapp_image, get_buyer_phone_number, get_seller_phone_number
from communications.line_message import send_line_image, get_buyer_user_ids, get_seller_user_ids

#Database
client = pymongo.MongoClient("mongodb://localhost:27017/")
user_db = client["user_data"]
user_collection = user_db["users"]

#for testing ngrok url
ngrok_url = "https://ce15-2001-b011-4008-1f3d-4d39-e511-56af-b367.ngrok-free.app/"
image_url = f"{ngrok_url}/offers/table.png"

# Create a Flask app
app = Flask(__name__)
# Register Blueprints with unique names
app.register_blueprint(whatsapp_blueprint, name='whatsapp')
app.register_blueprint(line_blueprint, name='line')

# Send Offer Message Whatsapp
def send_offer_message_to_buyers_whatsapp(image_url):
    # Get the list of buyer phone numbers
    buyer_phone_numbers = get_buyer_phone_number()
    
    # Iterate over each buyer's phone number
    for phone_number in buyer_phone_numbers:
        if phone_number:  # Check if phone number is not None or False
            print("Sending offer to WhatsApp user:", phone_number)
            send_whatsapp_image(phone_number, image_url)
        else:
            print("Skipping invalid phone number")

#Send Offer Message Line
def send_offer_message_to_buyers_line(image_url):
    buyer_user_ids = get_buyer_user_ids()

    for user_id in buyer_user_ids:
        print("sending offer to line user:", user_id)
        send_line_image(user_id, image_url)

# Send Inquiry Message Whatsapp
def send_inquiry_message_to_sellers_whatsapp(image_url):
    seller_phone_numbers = get_seller_phone_number()
    for phone_number in seller_phone_numbers:
        if phone_number:
            print("Sending inquiry to WhatsApp user:", phone_number)
            send_whatsapp_image(phone_number, image_url)
        else:
            print("Skipping invalid phone number for seller")

#Send Inquiry Message Line
def send_inquiry_message_to_sellers_line(image_url):
    seller_user_ids = get_seller_user_ids()
    for user_id in seller_user_ids:
        print("sending inquiry to line user:", user_id)
        send_line_image(user_id, image_url)

#scheduler functions to run
def do_shit():
    ngrok_url = "https://ce15-2001-b011-4008-1f3d-4d39-e511-56af-b367.ngrok-free.app/"
    
    # Get unique buyer and seller user IDs
    buyer_user_ids = set(get_buyer_user_ids())
    seller_user_ids = set(get_seller_user_ids())

    # Send offer messages
    for user_id in buyer_user_ids:
        image_url = f"{ngrok_url}/offers/table.png"
        send_offer_message_to_buyers_whatsapp(image_url)
        send_offer_message_to_buyers_line(image_url)

    # Send inquiry messages
    for user_id in seller_user_ids:
        image_url = f"{ngrok_url}/inquiries/table.png"
        send_inquiry_message_to_sellers_whatsapp(image_url)
        send_inquiry_message_to_sellers_line(image_url)

# Define a scheduler
scheduler = BackgroundScheduler(timezone=timezone('Asia/Taipei'))
def schedule_generation():
    # Schedule inquiry and offer table generation at 9:30 am every day
    scheduler.add_job(generate_inquiry_table, 'cron', hour=10, minute=7, second=0)
    scheduler.add_job(generate_offer_table, 'cron', hour=10, minute=7, second=3)
    
# Start the scheduler
schedule_generation()
scheduler.start()

#define offer_table route
@app.route('/offers/table.png')
def offer_table():
    image_path = '/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/backend/offers/table.png'  # Update with the correct file path
    return send_file(image_path, mimetype='image/png')

#define inquiry_table route
@app.route('/inquiries/table.png')
def inquiry_table():
    image_path = '/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/backend/inquiries/table.png'  # Update with the correct file path
    return send_file(image_path, mimetype='image/png')


#Main
if __name__ == '__main__':
    #only uncomment these lines if you want to generate the tables for testing
    #do_shit()
    #generate_inquiry_table()
    #generate_offer_table()
    # Run the Flask app
    app.run(debug=True)
