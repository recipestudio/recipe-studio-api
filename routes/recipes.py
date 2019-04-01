from flask import Blueprint, jsonify, make_response, request
from pymongo import MongoClient
from bson import objectid, json_util
import json
import os

# setup mongo client
# connect to mongo and get collection
DB_CONN_STR = os.getenv('DB_CONN_STR')
DB_NAME = os.getenv('DB_NAME')
RECIPE_COL = os.getenv('RECIPE_COL_NAME')

_mongoclient = MongoClient(DB_CONN_STR)
_DB = _mongoclient[DB_NAME]
_RECIPES = _DB[RECIPE_COL]

# setup route blueprint
recipe = Blueprint('recipe_route', __name__)


@recipe.route('/')
def default():
    return make_response('Malformed request', 400)

# Get all recipes
@recipe.route('/all', methods=['GET'])
def get_all_recipes():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Search recipes
@recipe.route('/search', methods=['GET'])
def search():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Create recipe
@recipe.route('/new', methods=['POST'])
def create_recipe():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Fetch, update, delete recipe
@recipe.route('/<recipe_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_recipe(recipe_id):
    if request.method == 'GET':
        return get_recipe(recipe_id)
    elif request.method == 'PUT':
        return update_recipe(recipe_id)
    elif request.method == 'DELETE':
        return delete_recipe(recipe_id)
    else:
        return make_response('Malformed request', 400)


def get_recipe(r_id):
    result = _RECIPES.find_one({'_id': objectid.ObjectId(r_id)})
    print(result)
    json_result = json.dumps(
        result, default=json_util.default)  # .decode('UTF-8')
    if result is not None:
        response = make_response(json_result, 200)
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        return make_response(
            jsonify({
                'message': 'Recipe ' + r_id + ' not found'
            }), 404
        )


def update_recipe(r_id):
    return 'updated {}'.format(r_id)


def delete_recipe(r_id):
    return 'deleted {}'.format(r_id)
