from flask import Flask, render_template, request, redirect, url_for, session, flash, send_file, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from modules.functions import login_required, init_user_db, admin_required, buyer_required, seller_required
from bson import ObjectId
from modules.database import SellerData
from pymongo.errors import ServerSelectionTimeoutError
from mongoengine import connect


app = Flask(__name__, static_folder="../frontend/static", template_folder="../frontend/templates", static_url_path="/static")

# Configure MongoDB connection for Coal Database
app.config['MONGO_URI_COAL'] = 'mongodb://localhost:27017/coal_database'
mongo_coal = PyMongo(app, uri=app.config['MONGO_URI_COAL'])

# Configure MongoDB connection for User Data
app.config['MONGO_URI_USER'] = 'mongodb://localhost:27017/user_database'
mongo_user = PyMongo(app, uri=app.config['MONGO_URI_USER'])

# Configure MongoDB connection for Seller Data
app.config['MONGO_URI_SELLER'] = 'mongodb://localhost:27017/seller_data'
mongo_seller = PyMongo(app, uri=app.config['MONGO_URI_SELLER'])

app.secret_key = "yF7QQh0QukGNA5MjvSJVp6MEVPrp6Uh3"
_actual_secret_password = "VIRTUIT"

# Function to convert binary data to a PDF file
def save_binary_to_pdf(binary_data, output_path):
    try:
        with open(output_path, 'wb') as file:
            file.write(binary_data)
    except Exception as e:
        print(f"Error saving PDF: {e}")

# Function to hash passwords
def hash_password(password):
    return generate_password_hash(password)

# home page
@app.route('/')
@login_required
@admin_required
def home():
    data = mongo_coal.db.coal_database.find()
    return render_template('home.html', data=data)

# home advance page
@app.route('/home_full_view')
@login_required
@admin_required
def home_full_view():
    data = mongo_coal.db.coal_database.find()
    return render_template('home_full_view.html', data=data)

#list users page
@app.route('/list_users')
@login_required
@admin_required
def list_users():
    data = mongo_user.db.user_data.find()
    return render_template('list_users.html', data=data)

# login route
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = mongo_user.db.user_data.find_one({"username": username})

        if user and check_password_hash(user["password"], password):
            session["username"] = user["username"]
            session["role"] = user["role"]
            flash("You have successfully logged in.")
            if session["role"] == "admin":
                return redirect(url_for("home"))
            elif session["role"] == "buyer":
                return redirect(url_for("buyer"))
            elif session["role"] == "seller":
                return redirect(url_for("seller"))
        else:
            flash("Login failed. Try again.")

    return render_template("/login.html")

# register route
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # check if secret password is correct
        secret_password = request.form.get("secret_password")
        if secret_password != _actual_secret_password:
            flash("You are not authorized to register. Please contact system admin.")
            return redirect(url_for("register"))

        # if secret password is correct, continue with registration
        username = request.form.get("username")
        password = request.form.get("password")
        company_name = request.form.get("company_name")
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        role = request.form.get("role")

        # Check if the user already exists
        if mongo_user.db.user_data.find_one({"username": username}):
            flash("Username already exists. Please choose another.")
        else:
            # Create a new user in the MongoDB collection with hashed password
            hashed_password = hash_password(password)
            mongo_user.db.user_data.insert_one({"username": username, "password": hashed_password, "role": role, "company_name": company_name, "name": name, "email": email, "phone": phone})
            flash("Registration successful.")
            return redirect(url_for("login"))

    return render_template("/register.html")

# logout route
@app.route("/logout")
def logout():
    session.pop("username", None)
    flash("You have successfully logged out.")
    return redirect(url_for("login"))

# buy route test
@app.route('/buyer')
@login_required
@buyer_required
def buyer():
    return render_template('buyer.html')

# buyer search route
@app.route('/buyer_search', methods=['GET', 'POST'])
@login_required
@buyer_required
def buyer_search():
    if request.method == 'POST':
        # Fetch user input from the form
        country_origin = request.form.get('country_origin')
        select_unit = request.form.get('select_unit')
        gcv = request.form.get('gcv')
        max_tm = request.form.get('max_tm')
        total_quantity = request.form.get('total_quantity')

        # Construct the MongoDB query based on user input
        query = {
        'Country': country_origin,
        '$or': [
            {'GCV_ADB': {'$gte': 0.9 * float(gcv), '$lte': 1.1 * float(gcv)}},  # 10% variation
            {'GAR': {'$gte': 0.9 * float(gcv), '$lte': 1.1 * float(gcv)}},  # 10% variation
        ],
        'TM_ARB': {'$lte': float(max_tm)},
        # Add more conditions as needed based on your data model
        }

        # Perform the MongoDB query
        data = mongo_coal.db.coal_database.find(query)

        # Render the buyer.html template with the query results
        return render_template('buyer.html', data=data)

    # If the request method is not POST, redirect to the buyer page
    return redirect(url_for('buyer'))

# sell route test
@app.route('/seller')
@login_required
@seller_required
def seller():
    return render_template('seller.html')

# Update the seller_search route to use mongoengine
@app.route('/seller_search', methods=['GET', 'POST'])
@login_required
@seller_required
def seller_search():
    if request.method == 'POST':
        # Fetch user input from the form
        country_of_origin = request.form.get('country_of_origin')
        mine_name = request.form.get('mine_name')
        loading_port = request.form.get('loading_port')
        average_laycan = int(request.form.get('average_laycan'))
        typical_gcv_gar = request.form.get('typical_gcv_gar')
        typical_tm = int(request.form.get('typical_tm'))
        expected_price = request.form.get('expected_price')
        loading_rate = request.form.get('loading_rate')
        contact_pic = request.form.get('contact_pic')
        contact_pic_email = request.form.get('contact_pic_email')

        # Construct the MongoDB document based on user input
        seller_data = SellerData(
            country_of_origin=country_of_origin,
            mine_name=mine_name,
            loading_port=loading_port,
            average_laycan=average_laycan,
            typical_gcv_gar=typical_gcv_gar,
            typical_tm=typical_tm,
            expected_price=expected_price,
            loading_rate=loading_rate,
            contact_pic=contact_pic,
            contact_pic_email=contact_pic_email
            # Add more fields as needed based on your data model
        )

        # Perform the MongoDB insert
        try:
            seller_data.save(write_concern={'w': 1, 'j': True, 'wtimeout': 1000})
            flash("Data submitted successfully.")
            return jsonify({"status": "success"})
        except Exception as e:
            flash(f"Error: {e}")
            return jsonify({"status": "error", "message": str(e)})

    # Redirect to the seller page
    return redirect(url_for('seller'))

@app.route('/download_coa/<coa_id>')
@login_required
@admin_required
def download_coa(coa_id):
    coal_data = mongo_coal.db.coal_database.find_one({"_id": ObjectId(coa_id)})
    if coal_data:
        # Assuming you want to save the PDF in the same directory as your script
        output_path = f"COA_{coa_id}.pdf"
        
        # Save binary data to PDF file
        save_binary_to_pdf(coal_data['coa_content'], output_path)
        
        # Send the file for download
        return send_file(output_path, as_attachment=True, download_name=f"COA_{coa_id}.pdf")
    else:
        flash("COA not found.")
        return redirect(url_for('home_full_view'))

# Run Flask App
if __name__ == "__main__":
    init_user_db()
    app.run(debug=True, host="0.0.0.0", port=5000)
