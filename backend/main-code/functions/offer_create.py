import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

def generate_offer_table():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    offer_db = client['offer_db']
    offer_collection = offer_db['offer_messages']
    today_offer_collection = offer_db['today_offer_collection']

    # Retrieve the latest 5 offers
    offers = list(offer_collection.find().sort('_id', -1).limit(5))

    # Extract required fields from offers and add order number
    data = []
    for idx, offer in enumerate(offers, start=1):
        data.append({
            'No.': idx,
            'GAR': f"{offer['min_gar']} - {offer['max_gar']}",
            'ash': f"{offer['min_ash']} - {offer['max_ash']}",
            'volume': offer['volume'],
            'laycan': offer['laycan'],
            'port': offer['port']
        })

    # Create a DataFrame from the data
    df = pd.DataFrame(data)

    # Create a table
    plt.figure(figsize=(10, 6))
    plt.axis('off')

    # Add a heading and subheading
    plt.text(0.5, 0.95, 'Virtuit Co., Ltd', ha='center', fontsize=14)
    plt.text(0.5, 0.9, "Today's Coal Offer", ha='center', fontsize=12)

    # Add the table
    plt.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center')

    # Add table creation date and time
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d %H:%M:%S")
    plt.text(0.99, 0.01, f"Offer generated on: {date_time}", ha='right', fontsize=10)

    # Define the directory path
    directory_path = '/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/backend/offers/'

    # Check if the directory exists, if not, create it
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

    # Save the table as a PNG file
    file_path = os.path.join(directory_path, 'table.png')
    plt.savefig(file_path)
    plt.close()

    # Clear today's offers in the collection
    today_offer_collection.delete_many({})

    # Insert today's offers into the collection
    offer_ids = [offer['_id'] for offer in offers]
    today_offers = [{'order': idx, 'offer_id': offer_id} for idx, offer_id in enumerate(offer_ids, start=1)]
    today_offer_collection.insert_many(today_offers)
    print("Offer table generated successfully")
