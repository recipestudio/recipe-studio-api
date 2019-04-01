from bson import errors, json_util, objectid
from flask import Blueprint, make_response, request
from pprint import pprint
from pymongo import MongoClient

import datetime
import json
import os


class Ingredient:
    """
        Class to represent ingredient objects locally.

        Attributes:
            i_id (str): Ingredient ID (Mongo ObjectID)
            category (str): Ingredient category
            created (str): Date/time data in datetime format
            name (str): Ingredient name            
    """

    i_id = ''
    created = ''
    category = ''
    name = ''

    def __init__(self, name, category, created):
        self.created = created
        self.category = category
        self.name = name

    def to_dict(self):
        _dict = {}
        _dict['_id'] = str(self.i_id)
        _dict['created'] = str(self.created)
        _dict['category'] = self.category
        _dict['name'] = self.name

        return _dict


class DbConnError(Exception):
    """Handler for errors in the database connection"""

    def __init__(self, message):
        self.message = message


# setup mongo client
# connect to mongo and get collection
DB_CONN_STR = os.getenv('DB_CONN_STR')
DB_NAME = os.getenv('DB_NAME')
INGREDIENT_COL = os.getenv('INGREDIENT_COL_NAME')

if (DB_CONN_STR is None or DB_CONN_STR == ''):
    raise DbConnError('Variable DB_CONN_STR is not set')
if (DB_NAME is None or DB_NAME == ''):
    raise DbConnError('Variable DB_NAME is not set')
if (INGREDIENT_COL is None or INGREDIENT_COL == ''):
    raise DbConnError('Variable INGREDIENT_COL_NAME is not set')

_mongoclient = MongoClient(DB_CONN_STR)
_DB = _mongoclient[DB_NAME]
_INGREDIENTS = _DB[INGREDIENT_COL]

ingredient = Blueprint('ingredient_route', __name__)


@ingredient.route('/')
def default():
    return make_response(jsonify({'message': 'Malformed request'}), 400)

# Fetch ingredient
@ingredient.route('/<ingredient_id>', methods=['GET'])
def manage_ingredient(ingredient_id):
    response = get_ingredient(ingredient_id)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Content-Type'] = 'application/json'
    return response


# Get all ingredients
@ingredient.route('/all', methods=['GET'])
def get_all_ingredients():
    results = []
    raw_results = _INGREDIENTS.find()
    for result in raw_results:
        formatted_result = read_bson(result)
        results.append(formatted_result)

    response = {}
    if result is not None:
        response = make_response(jsonify(results), 200)
    else:
        response = make_response(jsonify({}), 404)

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Content-Type'] = 'application/json'
    return response

# Search ingredients
@ingredient.route('/search', methods=['GET'])
def search():
    data = '{}'
    response = make_response(jsonify(data), 200)
    return response

# Create ingredient
@ingredient.route('/new', methods=['POST'])
def create_ingredient():
    data = '{}'
    response = make_response(jsonify(data), 200)
    return response


def get_ingredient(i_id):
    try:
        result = _INGREDIENTS.find_one({'_id': objectid.ObjectId(i_id)})
    except errors.InvalidId:
        return make_response(
            jsonify({'message': 'Ingredient ' + i_id + ' not found'}), 404)

    if result is not None:
        formatted_result = read_bson(result)
        response = make_response(jsonify(formatted_result), 200)
    else:
        response = make_response(
            jsonify({'message': 'Ingredient ' + i_id + ' not found'}), 404)

    return response


def read_bson(bson_data):
    # print('BSON')
    # pprint(bson_data)

    # extract data from bson and import to local Ingredient object
    i_id = bson_data['_id']
    category = bson_data['category']
    created = bson_data['created']
    name = bson_data['name']

    ingredient_obj = Ingredient(name, category, created)

    ingredient_obj.i_id = i_id
    ingredient_dict = ingredient_obj.to_dict()

    # print('JSON')
    # pprint(ingredient_dict)
    return ingredient_dict


def jsonify(obj):
    return json.dumps(obj, default=json_util.default)
