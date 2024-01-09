#imports
import sqlite3
from functools import wraps
from flask import session, flash, redirect, url_for



# initializing the database for login and register
def init_db():
    with sqlite3.connect("login.db") as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
                       CREATE TABLE IF NOT EXISTS users(
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           username TEXT NOT NULL,
                           password TEXT NOT NULL
                           )
                        """
        )
        connection.commit()


# login required function
def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "username" in session:
            return view(*args, **kwargs)
        else:
            flash("You need to login first")
            return redirect(url_for("login"))

    return wrapped_view