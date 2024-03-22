#includes functions to convert timestamp, check if the message is an offer selection, offer message or inquire message

import datetime
import re

#Function to convert timestamp
def convert_timestamp(timestamp_og_int):
    dt_object = datetime.datetime.fromtimestamp(timestamp_og_int)
    # Format datetime object as a readable date and time
    readable_date_time = dt_object.strftime('%Y-%m-%d %H:%M:%S')
    return readable_date_time

# Function to check if the message is an offer selection
def is_offer_selection(text):
    return re.match(r"select: (\d+)", text)

# Function to check if the message is an offer confirmation
def is_offer_confirmation(text):
    return re.match(r"confirm: (\d+)", text)

#Check if the message is an offer message
def is_offer_message(text):
    # Check if the text matches the offer message pattern
    pattern = r"offer: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+) Country (\w+) Mine Name (\w+)"
    return re.match(pattern, text)

'''
re pattern explanation: offer | inquire both have the same pattern
1. GAR (\d+)(?:-(\d+))? - matches the GAR number, which is a digit or a range of digits separated by a hyphen
2. Ash (\d+)(?:-(\d+))? - matches the Ash number, which is a digit or a range of digits separated by a hyphen
3. Volume (\d+) - matches the Volume number, which is a digit
4. Laycan \((.*?)\) - matches the Laycan date, which is a string enclosed in parentheses
5. Port (\w+) - matches the Port name, which is a word character
6. Country (\w+) - matches the Country name, which is a word character
7. Mine Name (\w+) - matches the Mine Name, which is a word character
'''

#Check if the message is an inquire message
def is_inquire_message(text):
    # Check if the text matches the inquire message pattern
    pattern = r"inquire: GAR (\d+)(?:-(\d+))? Ash (\d+)(?:-(\d+))? Volume (\d+) Laycan \((.*?)\) Port (\w+) Country (\w+) Mine Name (\w+)"
    return re.match(pattern, text)
