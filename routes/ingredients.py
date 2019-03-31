from flask import Blueprint, jsonify, make_response, request
import json

ingredient = Blueprint('ingredient_route', __name__)

@ingredient.route('/')
def default():
    return make_response('Malformed request', 400)

# Get all ingredients
@ingredient.route('/all', methods=['GET'])
def get_all_ingredients():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Search ingredients
@ingredient.route('/search', methods=['GET'])
def search():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Create ingredient
@ingredient.route('/new', methods=['POST'])
def create_ingredient():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Fetch ingredient
@ingredient.route('/<ingredient_id>', methods=['GET'])
def manage_ingredient(ingredient_id):
    return get_ingredient(ingredient_id)

# ingredient methods
def get_ingredient(id):
    return 'fetched {}'.format(id)
