#imports
import sqlite3
from functools import wraps
from flask import session, flash, redirect, url_for

#below function is used to initialize the User database for the application

# initializing the database for login and register
def init_user_db():
    with sqlite3.connect("user.db") as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
                       CREATE TABLE IF NOT EXISTS users(
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           username TEXT NOT NULL,
                           password TEXT NOT NULL,
                            role TEXT NOT NULL
                           )
                        """
        )
        connection.commit()

# login required decorator
def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "username" in session:
            return view(*args, **kwargs)
        else:
            flash("You need to login first")
            return redirect(url_for("login"))

    return wrapped_view

# admin required decorator
def admin_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "username" in session and session.get('role') == 'admin':
            return view(*args, **kwargs)
        else:
            flash("You need to be an admin to access this page")
            return redirect(url_for("login"))

    return wrapped_view

# buyer required decorator
def buyer_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "username" in session and session.get('role') == 'buyer':
            return view(*args, **kwargs)
        else:
            flash("You need to be an buyer to access this page")
            return redirect(url_for("login"))

    return wrapped_view

# seller required decorator
def seller_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "username" in session and session.get('role') == 'seller':
            return view(*args, **kwargs)
        else:
            flash("You need to be an seller to access this page")
            return redirect(url_for("login"))

    return wrapped_view

#function to convert COA pdf to BLOB for database
def convertToBinaryData(filename):
    #Convert digital data to binary format
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData
# blobData is to be stored in database as BLOB type for COA PDF.

#function to convert BLOB to pdf and provide it as a download link using flask route
def convertToPDFData(blobData):
    #Convert digital data to binary format
    with open("temp.pdf", 'wb') as file:
        file.write(blobData)
    return "temp.pdf"
