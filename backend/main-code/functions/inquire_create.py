import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import matplotlib.pyplot as plt
import os

def generate_inquiry_table():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    inquire_db = client['inquire_db']
    inquire_collection = inquire_db['inquire_messages']
    today_inquire_collection = inquire_db['today_inquire_collection']

    directory_path = '/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/backend/inquiries/'

    # Retrieve the latest 5 inquiries
    latest_inquiries = list(inquire_collection.find().sort('_id', -1).limit(5))

    # Extract required fields from inquiries and add order number
    inquiry_data = []
    for idx, inquiry in enumerate(latest_inquiries, start=1):
        inquiry_data.append({
            'No.': idx,
            'GAR': f"{inquiry['min_gar']} - {inquiry['max_gar']}",
            'ash': f"{inquiry['min_ash']} - {inquiry['max_ash']}",
            'volume': inquiry['volume'],
            'laycan': inquiry['laycan'],
            'port': inquiry['port']
        })

    # Create a DataFrame from the data
    df = pd.DataFrame(inquiry_data)

    # Create a table
    plt.figure(figsize=(10, 6))
    plt.axis('off')

    # Add a heading and subheading
    plt.text(0.5, 0.95, 'Virtuit Co., Ltd', ha='center', fontsize=14)
    plt.text(0.5, 0.9, "Today's Coal Inquiries", ha='center', fontsize=12)

    # Add the table
    plt.table(cellText=df.values, colLabels=df.columns, cellLoc='center', loc='center')

    # Add table creation date and time
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d %H:%M:%S")
    plt.text(0.99, 0.01, f"Inquiries generated on: {date_time}", ha='right', fontsize=10)

    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

    file_path = os.path.join(directory_path, 'table.png')

    # Save the table as a PNG file
    plt.savefig(file_path)
    plt.close()

    # Clear today's inquiries in the collection
    today_inquire_collection.delete_many({})

    # Insert today's inquiries into the collection
    inquire_ids = [inquiry['_id'] for inquiry in latest_inquiries]
    today_inquires = [{'order': idx, 'inquire_id': inquire_id} for idx, inquire_id in enumerate(inquire_ids, start=1)]
    today_inquire_collection.insert_many(today_inquires)
    print("Inquiry table generated successfully")