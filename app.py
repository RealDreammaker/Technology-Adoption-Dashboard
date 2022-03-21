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

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "postgresql://postgres:postgres@localhost:5432/technology_db"

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
    mobile_subscriptions_per_hundred = db.Column(db.Float)
    gdp = db.Column(db.Float)

class Fixed(db.Model):
    __tablename__ = 'fixed_telephone'
    id = db.Column(db.Integer, primary_key=True)
    entity = db.Column(db.String(255))
    code = db.Column(db.String(255))
    year = db.Column(db.Integer)
    fixed_subscriptions_per_hundred = db.Column(db.Float)
    gdp = db.Column(db.Float)

class Geojson(db.Model):
    geojson = db.Column(db.JSON)
    id = db.Column(db.Integer, primary_key=True)

###ROUTES###
#render index.html
@app.route("/")
def home():
      
    return render_template("index.html")

#retrieve data from database
@app.route('/api/fixed')
def fixed():

    fixed_results = db.session.query(Fixed.entity, Fixed.code, Fixed.year, Fixed.fixed_subscriptions_per_hundred, Fixed.gdp).all()

    entity = [result[0] for result in fixed_results]
    code = [result[1] for result in fixed_results]
    year = [result[2] for result in fixed_results]
    subscriptions = [result[3] for result in fixed_results]

    fixed_data = [{
        "entity":entity,
        "code":code,
        "year":year,
        "subscriptions":subscriptions
    }]

    return jsonify(fixed_data)

@app.route('/api/mobile')
def mobile():

    mobile_results = db.session.query(Mobile.entity, Mobile.code, Mobile.year, Mobile.mobile_subscriptions_per_hundred, Fixed.gdp).all()

    entity = [result[0] for result in mobile_results]
    code = [result[1] for result in mobile_results]
    year = [result[2] for result in mobile_results]
    subscriptions = [result[3] for result in mobile_results]

    mobile_data = [{
        "entity":entity,
        "code":code,
        "year":year,
        "subscriptions":subscriptions
    }]

    return jsonify(mobile_data)


@app.route('/api/geojson')
def geojson():
    geojson_results = db.session.query(Geojson.geojson)
    geojson = [result[0] for result in geojson_results]
    return jsonify(geojson)

if __name__ == '__main__':
    app.run(debug=True)