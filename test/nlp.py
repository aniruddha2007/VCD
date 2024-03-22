import datetime

timestamp = 1709272961
# Convert Unix timestamp to datetime object
dt_object = datetime.datetime.fromtimestamp(timestamp)

# Format datetime object as a readable date and time
readable_date_time = dt_object.strftime('%Y-%m-%d %H:%M:%S')

print("Readable Date and Time:", readable_date_time)
