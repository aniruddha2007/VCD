from mongoengine import connect, Document, StringField, BinaryField
from pymongo.errors import ServerSelectionTimeoutError
import time

# Configure MongoDB connection with timeout
try:
    connect('coal_database', host='mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
    print("Connected to MongoDB.")
except ServerSelectionTimeoutError:
    print("Timeout: Unable to connect to MongoDB. Check your connection.")

pdf_file_path = "/Users/aniruddhapandit/Library/CloudStorage/Dropbox/PROJECT/Virtuit/VCD/Reference/coa.pdf"

# Define CoalDatabase schema
class CoalDatabase(Document):
    country = StringField(max_length=50)
    mine_name = StringField(max_length=50)
    gcv_adb = StringField(max_length=50)
    gar = StringField(max_length=50)
    gcv_arb = StringField(max_length=50)
    ncv_arb = StringField(max_length=50)
    tm_arb = StringField(max_length=50)
    im_adb = StringField(max_length=50)
    ash_adb = StringField(max_length=50)
    ash_db = StringField(max_length=50)
    ts_adb = StringField(max_length=50)
    ts_db = StringField(max_length=50)
    loading_port = StringField(max_length=50)
    vessel_type = StringField(max_length=50)
    loading_laycan = StringField(max_length=50)
    coa_filename = StringField(max_length=255)
    coa_content = BinaryField()
    price_usd = StringField(max_length=50)
    supplier = StringField(max_length=50)
    vm_adb = StringField(max_length=50)
    vm_db = StringField(max_length=50)
    fixed_carbon_adb = StringField(max_length=50)
    ash_fusion_temp_idt = StringField(max_length=50)
    hgi = StringField(max_length=50)
    loading_rate = StringField(max_length=50)
    contact_pic = StringField(max_length=50)
    size_distribution_0_50mm = StringField(max_length=50)
    size_distribution_above_50mm = StringField(max_length=50)
    size_distribution_under_2mm = StringField(max_length=50)
    size_distribution_under_0_5mm = StringField(max_length=50)
    potential_buyer = StringField(max_length=50)
    coal_type = StringField(max_length=50)

# Read COA file
def read_pdf_to_binary(file_path):
    try:
        with open(file_path, 'rb') as file:
            binary = file.read()
            return binary
    except FileNotFoundError:
        print('File not found')
        return None

coa_content_data = read_pdf_to_binary(pdf_file_path)

# Dummy data
coal = CoalDatabase(
    country='Brazil',
    mine_name='123 Mines',
    gcv_adb='5100',
    gar='4900',
    gcv_arb='5000',
    ncv_arb='4800',
    tm_arb='18',
    im_adb='4600',
    ash_adb='5200',
    ash_db='5000',
    ts_adb='4500',
    ts_db='4300',
    loading_port='Rio de Janeiro',
    vessel_type='Handysize',
    loading_laycan='12 days',
    coa_filename='coa_123.pdf',
    coa_content=coa_content_data,
    price_usd='4800',
    supplier='DEF Suppliers',
    vm_adb='4300',
    vm_db='4100',
    fixed_carbon_adb='4600',
    ash_fusion_temp_idt='5000',
    hgi='4500',
    loading_rate='4800',
    contact_pic='Alice Doe',
    size_distribution_0_50mm='5100',
    size_distribution_above_50mm='2800',
    size_distribution_under_2mm='4200',
    size_distribution_under_0_5mm='1800',
    potential_buyer='123 Corporation',
    coal_type='Sub-bituminous'
)

# Save data to the 'coal_database' collection with loading system
try:
    print("Saving data to MongoDB...")
    coal.save(write_concern={'w': 1, 'j': True, 'wtimeout': 1000})
    print("Data saved successfully.")
except ServerSelectionTimeoutError:
    print("Timeout: Unable to save data. Check your connection.")
except Exception as e:
    print(f"Error: {e}")

# Add a delay to see the console messages
time.sleep(2)
