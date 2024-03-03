# import pandas as pd
# import matplotlib.pyplot as plt
# from io import BytesIO
# from pymongo import MongoClient

# def create_offer_table_image():
#     # Connect to MongoDB
#     client = MongoClient("mongodb://localhost:27017/")
#     db = client["offer_db"]  # Replace "your_database_name" with your actual database name
#     offer_collection = db["offer_messages"]  # Assuming your offer collection is named "offer"

#     # Retrieve offers from the database
#     offers = list(offer_collection.find({}))

#     if not offers:
#         print("No offers found.")
#         return

#     # Create DataFrame from offers
#     df = pd.DataFrame(offers)

#     # Drop unnecessary columns (e.g., _id, sender, timestamp, user)
#     df.drop(['_id', 'sender', 'timestamp', 'user'], axis=1, inplace=True)

#     # Set index to start from 1 instead of 0
#     df.index += 1

#     # Create a table plot using Matplotlib
#     fig, ax = plt.subplots(figsize=(10, 6))
#     ax.axis('tight')
#     ax.axis('off')
#     ax.table(cellText=df.values, colLabels=df.columns, loc='center')

#     # Save the table as a PNG image
#     buffer = BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)

#     # Clear the plot
#     plt.close(fig)

#     return buffer

# if __name__ == "__main__":
#     table_image = create_offer_table_image()
#     with open("offer_table.png", "wb") as f:
#         f.write(table_image.getvalue())

import requests
import json
import base64
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
from pymongo import MongoClient

access_token = "EAAEzvLRXAZCEBO4ZBxnXytpteLcQUARwCvsqFrTf0b4if3lSdmiiB1Hdg9lxmloE1tJKee2YCpyF4yPDN2NDQSxPFuTxoZAOG8UY1BHcvanOYAV3Y84LjkySJ7tl1fyh7mgZBzlzKc6yMxFRswcvaZC3yeGX3ZAPkJCFKUYFPZBIjoRFSOblNZCdnlClrhJaXs0s0gSfPhzlDUPvvjJdbAZBmiPMuXhjXOinaAZAwZD"  # Your Facebook Access Token
from_phone_number_id = "243106965553162"  # Your WhatsApp Business Account ID
image_link ="https://bdf5-2001-b011-4008-1c8f-743f-6430-ddd7-f996.ngrok-free.app/image"
def create_offer_table_image():
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["offer_db"]  # Replace "your_database_name" with your actual database name
    offer_collection = db["offer_messages"]  # Assuming your offer collection is named "offer"

    # Retrieve offers from the database
    offers = list(offer_collection.find({}))

    if not offers:
        print("No offers found.")
        return None

    # Create DataFrame from offers
    df = pd.DataFrame(offers)

    # Drop unnecessary columns (e.g., _id, sender, timestamp, user)
    df.drop(['_id', 'sender', 'timestamp', 'user'], axis=1, inplace=True)

    # Set index to start from 1 instead of 0
    df.index += 1

    # Create a table plot using Matplotlib
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.axis('tight')
    ax.axis('off')
    ax.table(cellText=df.values, colLabels=df.columns, loc='center')

    # Save the table as a PNG image
    image_path = "offer_table.png"
    plt.savefig(image_path, format='png')

    # Clear the plot
    plt.close(fig)

    return image_path

def send_whatsapp_image(recipient_phone_number, image_link, access_token, from_phone_number_id):
    url = f"https://graph.facebook.com/v19.0/{from_phone_number_id}/messages"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient_phone_number,
        "type": "image",
        "image": {
            "link": image_link
        }
    }

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    return response.json()
def get_buyer_wa_id():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["user_data"]
    users_collection = db["users"]
    buyer_user = users_collection.find_one({"category": "seller"})
    if buyer_user:
        return buyer_user["wa_id"]
    else:
        return None

if __name__ == "__main__":
    # Create the offer table image
    image_path = create_offer_table_image()

    if image_path:
        # Retrieve buyer's WhatsApp ID
        recipient_phone_number = '919850416007'

        if recipient_phone_number:
            # Send the WhatsApp image message
            send_whatsapp_image(recipient_phone_number, image_link, access_token, from_phone_number_id)
            print("Offer table image sent successfully to", recipient_phone_number)
        else:
            print("Buyer's WhatsApp ID not found.")
    else:
        print("Failed to create offer table image.")