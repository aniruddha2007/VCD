#imports
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    send_file,
    session,
    jsonify,
    flash,
)
from flask_sqlalchemy import SQLAlchemy
from modules.functions import (
    login_required,
    init_user_db,
    admin_required,
    buyer_required,
    seller_required,
    
)
# from modules.database import(
#     #Database,
#     db
# )
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3


# initializing the app
app = Flask(__name__, static_folder="../frontend/static", template_folder="../frontend/templates", static_url_path="/static")
db = SQLAlchemy()
# configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coal_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
app.secret_key = "yF7QQh0QukGNA5MjvSJVp6MEVPrp6Uh3"
_actual_secret_password = "VIRTUIT"

class CoalDatabase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Country = db.Column(db.String(50))
    MineName = db.Column(db.String(50))
    GCV_ADB = db.Column(db.String(50))
    GAR = db.Column(db.String(50))
    GCV_ARB = db.Column(db.String(50))
    NCV_ARB = db.Column(db.String(50))
    TM_ARB = db.Column(db.String(50))
    IM_ADB = db.Column(db.String(50))
    Ash_ADB = db.Column(db.String(50))
    Ash_DB = db.Column(db.String(50))
    TS_ADB = db.Column(db.String(50))
    TS_DB = db.Column(db.String(50))
    LoadingPort = db.Column(db.String(50))
    VesselType = db.Column(db.String(50))
    LoadingLaycan = db.Column(db.String(50))
    COA = db.Column(db.String(50))
    Price_USD = db.Column(db.String(50))
    Supplier = db.Column(db.String(50))
    VM_ADB = db.Column(db.String(50))
    VM_DB = db.Column(db.String(50))
    FixedCarbon_ADB = db.Column(db.String(50))
    AshFusionTemp_IDT = db.Column(db.String(50))
    HGI = db.Column(db.String(50))
    LoadingRate = db.Column(db.String(50))
    ContactPIC = db.Column(db.String(50))
    SizeDistribution_0_50mm = db.Column(db.String(50))
    SizeDistribution_above50mm = db.Column(db.String(50))
    SizeDistribution_under2mm = db.Column(db.String(50))
    SizeDistribution_under0_5mm = db.Column(db.String(50))
    PotentialBuyer = db.Column(db.String(50))
    CoalType = db.Column(db.String(50))

#home page
@app.route('/')
@login_required
@admin_required
def home():
    data = CoalDatabase.query.all()
    return render_template('home.html', data=data)

#home page
@app.route('/home_full_view')
@login_required
@admin_required
def home_full_view():
    data = CoalDatabase.query.all()
    return render_template('home_full_view.html', data=data)


# login route
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        with sqlite3.connect("user.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM users WHERE username = ? AND password = ?",
                (username, password),
            )
            result = cursor.fetchone()
        if result:
            session["username"] = result[1]
            session["role"] = result[3]
            flash("You have successfully logged in.")
            if session["role"] == "admin":
                return redirect(url_for("home"))
            elif session["role"] == "buyer":
                return redirect(url_for("buyer"))
            elif session["role"] == "seller":
                return redirect(url_for("seller"))
        else:
            flash("login failed. try again")

    return render_template("/login.html")

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
        if secret_password != _actual_secret_password:
            flash(
                "You are not authorized to register, Please contact system admin. 您沒有權限註冊，請聯絡系統管理員。"
            )
            return redirect(url_for("register"))

        # if secret password is correct, continue with registration
        username = request.form.get("username")
        password = request.form.get("password")
        role = request.form.get("role")

        with sqlite3.connect("user.db") as connection:
            cursor = connection.cursor()
            cursor.execute(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                (username, password, role),
            )
            connection.commit()
        flash("Registation successful.")
        return redirect(url_for("login"))

    return render_template("/register.html")

#buy route test
@app.route('/buyer')
@login_required
@buyer_required
def buyer():
    return render_template('buyer.html')

#buyer search route
@app.route('/buyer_search', methods=['POST'])
@login_required
@buyer_required
def buyer_search():
    if request.method == 'POST':
        search = request.form['search']
        data = CoalDatabase.query.filter(CoalDatabase.Country.contains(search)).all()
        return render_template('buyer.html', data=data)

#sell route test
@app.route('/seller')
@login_required
@seller_required
def seller():
    return render_template('seller.html')


# Run the Flask app
if __name__ == "__main__":
    init_user_db()
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=5000)