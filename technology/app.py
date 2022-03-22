###DEPENDENCIES###
from flask import Flask, render_template
import os
from sqlalchemy.orm import Session
from sqlalchemy import  Column, Integer, String, Float, JSON

from flask import Flask, jsonify

###FLASK SETUP###
app = Flask(__name__)

###DATABASE SETUP###
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "postgresql://postgres:38364431@localhost:5432/technology_db"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

db.drop_all()
db.create_all()

#create classes for tables
class Mobile(db.Model):
    __tablename__ = 'mobile_telephone'
    id = db.Column(db.Integer, primary_key=True)
    entity = db.Column(db.String(255))
    code = db.Column(db.String(255))
    year = db.Column(db.Integer)
    mobile_subscriptions = db.Column(db.Float)
    gdp = db.Column(db.Float)

class Geojson(db.Model):
    geojson = db.Column(db.JSON)
    id = db.Column(db.Integer, primary_key=True)

###ROUTES###
#render index.html
@app.route("/")
def home():
      
    return render_template("index.html")

@app.route('/api/mobile')
def mobile():

    mobile_results = db.session.query(Mobile.entity, Mobile.code, Mobile.year, Mobile.mobile_subscriptions, Mobile.gdp).all()

    mobile_data = []
    for entity, code, year, mobile, gdp in mobile_results:
        dict_var = {}
        dict_var['entity'] = entity
        dict_var['code'] = code
        dict_var['year'] = year
        dict_var['subscriptions'] = mobile
        dict_var['gdp'] = gdp
        
        mobile_data.append(dict_var)

    return jsonify(mobile_data)

@app.route('/api/countries')
def countries():
    country_results = db.session.query(Countries.entity,Countries.id)
    country_data = [result[0] for result in country_results]
    return jsonify(country_data)

if __name__ == '__main__':
    app.run(debug=True)