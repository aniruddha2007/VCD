import pandas as pd
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///coal_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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

db.create_all()
# Function to import data from CSV to SQLite database
def import_csv_to_database(csv_file_path):
    try:
        data = pd.read_csv(csv_file_path)
        
        # Ensure the data columns match the database columns
        if set(data.columns) == set(CoalDatabase.__table__.columns.keys()):
            with app.app_context():
                db.create_all()
                data.to_sql('coal_database', db.engine, if_exists='replace', index=False)
            print("Data imported successfully.")
        else:
            print("Column mismatch. Please check your CSV file and the database model.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    # Replace 'your_csv_file.csv' with the actual path to your CSV file
    import_csv_to_database('/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/Reference/Coal Sources.csv')
    app.run(debug=True)