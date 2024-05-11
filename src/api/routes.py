"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# user routes
@api.route('/user/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({"msg": "no such user"}), 404
    if user.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(
        identity=user.id,
        additional_claims = {"role": "owner"} 
        )
    return jsonify(access_token=access_token), 201


# customer routes

@api.route('/customer/signup', methods=['POST'])
def handle_customer_signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    address = request.json.get("address", None)
    phone = request.json.get("phone", None)
    if email is None or password is None or first_name is None or last_name is None or address is None or phone is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    customer = Customer(email=email, password=password, first_name=first_name, last_name=last_name, address=address, phone=phone, is_active=True)
    db.session.add(customer)
    db.session.commit()
    db.session.refresh(customer)
    response_body = {"msg": "Account succesfully created!", "customer":customer.serialize()}
    return jsonify(response_body), 201

@api.route('/customer/login', methods=['POST'])
def handle_customer_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer is None:
        return jsonify({"msg": "No such user"}), 404
    if customer.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=customer.id, additional_claims={"role": "customer"})

    return jsonify(access_token=access_token, customer_id=customer.id), 201


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
