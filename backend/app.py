#imports
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash
)
from flask_sqlalchemy import SQLAlchemy
from modules.functions import login_required, init_db
from modules.database import(
    Database,
    gcv_gar,
    gcv,
    ncv,
    tm,
    im,
    ash_adb,
    ash_db,
    ts_adb,
    ts_db,
    vm_adb,
    contact_pic,
    db
)
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3


# initializing the app
app = Flask(__name__)

# configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
app.secret_key = "yF7QQh0QukGNA5MjvSJVp6MEVPrp6Uh3"
SECRET_PASSWORD = "VIRTUIT"

#home page
@app.route('/')
@login_required
def home():
    for header in Database.query.all():
        print(header)
    return render_template('home.html', headers=Database.query.all())

# login route
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        with sqlite3.connect("login.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                (username, password),
            )
            result = cursor.fetchone()
        if result:
            session["username"] = username
            flash("You have successfully logged in.")
            return redirect(url_for("index"))
        else:
            flash("login failed. try again")

    return render_template('login.html')

# logout route
@app.route("/logout")
def logout():
    session.pop("username", None)
    flash("You have successfully logged out.")
    return redirect(url_for("login"))

# register route
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # check if secret password is correct
        secret_password = request.form.get("secret_password")
        if secret_password != SECRET_PASSWORD:
            flash(
                "You are not authorized to register, Please contact system admin. 您沒有權限註冊，請聯絡系統管理員。"
            )
            return redirect(url_for("register"))

        # if secret password is correct, continue with registration
        username = request.form.get("username")
        password = request.form.get("password")

        with sqlite3.connect("login.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, password),
            )
            connection.commit()
        flash("Registation successful.")
        return redirect(url_for("login"))

    return render_template('register.html')


# Run the Flask app
if __name__ == "__main__":
    init_db()
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5000)