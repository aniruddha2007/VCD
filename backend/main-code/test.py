import pandas as pd
from pymongo import MongoClient
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
import os

def generate_offer_table():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    offer_db = client['offer_db']
    offer_collection = offer_db['offer_messages']

    # Retrieve the latest 5 offers
    offers = list(offer_collection.find().sort('_id', -1).limit(5))

    # Extract required fields from offers and add order number
    data = []
    for idx, offer in enumerate(offers, start=1):
        data.append({
            'No.': idx,
            'status': offer['status'],
            'volume': offer['volume'],
            'laycan': offer['laycan'],
            'port': offer['port']
        })

    # Create a DataFrame from the data
    df = pd.DataFrame(data)

    # Open the logo image
    logo_img_path = 'logo_temp.png'
    logo_img = Image.open(logo_img_path)

    # Resize the image to match the dimensions of logo_temp.png
    width, height = 1920, 1080
    logo_img = logo_img.resize((width, height))

    # Set up drawing context
    draw = ImageDraw.Draw(logo_img)

    # Set font properties for headers
    header_font = ImageFont.load_default()  # You can also specify a custom font here if needed

    # Increase font size for data
    font_size = 72

    # Add table data
    y_offset = 500  # Adjust the vertical offset for the first row
    for index, row in df.iterrows():
        for i, (colname, cell) in enumerate(row.items()):  # Changed iteritems to items
            # Calculate the x-coordinate to center the text horizontally
            text_width, _ = draw.textsize(str(cell))
            x_offset = (300 - text_width) // 2  # Adjust the offset based on the cell width (300)
            # Header row
            if index == 0:
                draw.text((50 + i * 300 + x_offset, y_offset), colname, font=header_font, fill=(0, 0, 0))
            else:
                draw.text((50 + i * 300 + x_offset, y_offset), str(cell), fill=(0, 0, 0))
        y_offset += 50  # Adjust the vertical offset between rows

    # Add timestamp
    now = datetime.now()
    date_time = now.strftime("%Y-%m-%d %H:%M:%S")
    draw.text((50, 900), f"Offer generated on: {date_time}", fill=(0, 0, 0))

    # Save the modified image
    directory_path = '/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/backend/offers/'
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
    file_path = os.path.join(directory_path, 'table_with_data.png')
    logo_img.save(file_path)
    print("Offer table generated successfully")

generate_offer_table()
