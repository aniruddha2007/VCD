from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ##Main Database
# class Database(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     country = db.Column(db.String(50))
#     mine_name = db.Column(db.String(50))
#     gcv_gar = db.relationship('gcv_gar', backref='database', uselist=False)
#     gcv = db.relationship('gcv', backref='database', uselist=False)
#     ncv = db.relationship('ncv', backref='database', uselist=False)
#     tm = db.relationship('tm', backref='database', uselist=False)
#     im = db.relationship('im', backref='database', uselist=False)
#     ash_adb = db.relationship('ash_adb', backref='database', uselist=False)
#     ash_db = db.relationship('ash_db', backref='database', uselist=False)
#     ts_adb = db.relationship('ts_adb', backref='database', uselist=False)
#     ts_db = db.relationship('ts_db', backref='database', uselist=False)
#     loading_port = db.Column(db.String(50))
#     vessel_type = db.Column(db.String(50))
#     loading_laycan = db.Column(db.String(50))
#     coa = db.Column(db.BLOB)
#     suppilier = db.Column(db.String(50))
#     vm_adb = db.relationship('vm_adb', backref='database', uselist=False)
#     vm_db = db.Column(db.Integer)
#     fixed_carbon = db.Column(db.String(50))
#     ash_fusion_temp = db.Column(db.String(50))
#     hgi = db.Column(db.String(50))
#     loading_rate = db.Column(db.String(50))
#     contact_pic = db.relationship('contact_pic', backref='database', uselist=False)
#     size_distrubution_below_50 = db.Column(db.String(50))
#     size_distrubution_above_50 = db.Column(db.String(50))
#     size_distrubution_below_2 = db.Column(db.String(50))
#     size_distrubution_under_0_5 = db.Column(db.String(50))
#     potential_buyer = db.Column(db.String(50))
#     coal_type = db.Column(db.String(50))


# #relational GCV(ADB)GAR Database
# class gcv_gar(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     min = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('gcv_gar', lazy=True))


# #relational GCV(ADB) Database
# class gcv(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     min = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('gcv', lazy=True))

# #relational NCV Database
# class ncv(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     min = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('ncv', lazy=True))

# #relational TM(arb) Database
# class tm(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     min = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('tm', lazy=True))

# #relational IM(arb) Database
# class im(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('im', lazy=True))

# #relational Ash(ADB) Database
# class ash_adb(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('ash_adb', lazy=True))

# #relational Ash(DB) Database
# class ash_db(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('ash_db', lazy=True))

# #relational TS(ADB) Database
# class ts_adb(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('ts_adb', lazy=True))

# #relational TS(DB) Database
# class ts_db(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('ts_db', lazy=True))

# #relational VM(ADB) Database
# class vm_adb(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     min = db.Column(db.Integer)
#     max = db.Column(db.Integer)
#     typical = db.Column(db.Integer)
#     database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
#     database = db.relationship('Database', backref=db.backref('vm_adb', lazy=True))

# #relational Contact PIC Database
# class contact_pic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    phone = db.Column(db.String(50))
    email = db.Column(db.String(50))
    database_id = db.Column(db.Integer, db.ForeignKey('database.id'))
    database = db.relationship('Database', backref=db.backref('contact_pic', lazy=True))