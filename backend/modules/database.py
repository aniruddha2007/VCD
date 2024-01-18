from mongoengine import Document, StringField, IntField, FloatField

class SellerData(Document):
    country_of_origin = StringField(max_length=50)
    mine_name = StringField(max_length=50)
    loading_port = StringField(max_length=50)
    average_laycan = IntField()
    typical_gcv_gar = StringField(max_length=50)
    typical_tm = IntField()
    expected_price = StringField(max_length=50)
    loading_rate = StringField(max_length=50)
    contact_pic = StringField(max_length=50)
    contact_pic_email = StringField(max_length=50)