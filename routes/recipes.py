from bson import objectid, json_util
from flask import Blueprint, make_response, request
from pprint import pprint
from pymongo import MongoClient

import datetime
import json
import os


class Recipe:
    """
        Class to represent recipe objects locally.

        Attributes:
            r_id (str): Recipe ID (Mongo ObjectID)
            author (dict): Author data (uid, displayName)
            created (datetime): Date/time data in datetime format
            description (str): Recipe description
            directions (str): Recipe directions
            image (str): Image URL for recipe
            ingredients (Ingredient): Array of ingredient objects (see Ingredient class)
            name (str): Recipe name
    """

    r_id = ''
    author = {}
    created = ''
    description = ''
    directions = ''
    image = ''
    ingredients = []
    name = ''

    def __init__(self, author, created, description, directions, image, ingredients, name):
        self.author = author
        self.created = created
        self.description = description
        self.directions = directions
        self.image = image
        self.name = name

        # TODO: add Ingredient object parsing here.
        self.ingredients = ingredients

    def to_dict(self):
        _dict = {}
        _dict['_id'] = str(self.r_id)
        _dict['created'] = str(self.created)
        _dict['description'] = self.description
        _dict['directions'] = self.directions
        _dict['image'] = self.image
        _dict['name'] = self.name

        _dict['author'] = {}
        for key, val in self.author.items():
            _dict['author'][key] = val

        _dict['ingredients'] = []
        for ingredient in self.ingredients:
            _dict['ingredients'].append(ingredient)

        return _dict


class DbConnError(Exception):
    """Handler for errors in the database connection"""

    def __init__(self, message):
        self.message = message


# setup mongo client
# connect to mongo and get collection
DB_CONN_STR = os.getenv('DB_CONN_STR')
DB_NAME = os.getenv('DB_NAME')
RECIPE_COL = os.getenv('RECIPE_COL_NAME')

if (DB_CONN_STR is None):
    raise DbConnError('Variable DB_CONN_STR is not set')
if (DB_NAME is None):
    raise DbConnError('Variable DB_NAME is not set')
if (RECIPE_COL is None):
    raise DbConnError('Variable RECIPE_COL is not set')

_mongoclient = MongoClient(DB_CONN_STR)
_DB = _mongoclient[DB_NAME]
_RECIPES = _DB[RECIPE_COL]

# setup route blueprint
recipe = Blueprint('recipe_route', __name__)


@recipe.route('/')
def default():
    return make_response('Malformed request', 400)

# Fetch, update, delete recipe
@recipe.route('/<recipe_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_recipe(recipe_id):

    response = {}
    if request.method == 'GET':
        response = get_one_recipe(recipe_id)
    elif request.method == 'PUT':
        response = update_recipe(recipe_id)
    elif request.method == 'DELETE':
        response = delete_recipe(recipe_id)
    else:
        response = make_response('Malformed request', 400)

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Content-Type'] = 'application/json'
    return response


# Get all recipes
@recipe.route('/all', methods=['GET'])
def get_all_recipes():

    results = []
    raw_results = _RECIPES.find()
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

# Search recipes
@recipe.route('/search', methods=['GET'])
def search():
    data = '{}'
    response = make_response(jsonify(data), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Content-Type'] = 'application/json'
    return response

# Create recipe
@recipe.route('/new', methods=['POST'])
def create_recipe():
    data = '{}'
    response = make_response(jsonify(data), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Content-Type'] = 'application/json'
    return response


def get_one_recipe(r_id):
    result = _RECIPES.find_one({'_id': objectid.ObjectId(r_id)})
    if result is not None:
        formatted_result = read_bson(result)
        response = make_response(jsonify(formatted_result), 200)
    else:
        response = make_response(
            jsonify({
                'message': 'Recipe ' + r_id + ' not found'
            }), 404
        )

    return response


def update_recipe(r_id):
    return 'updated {}'.format(r_id)


def delete_recipe(r_id):
    return 'deleted {}'.format(r_id)


def read_bson(bson_data):
    # print('BSON')
    # pprint(bson_data)

    # extract data from bson and import to local Recipe object
    author = bson_data['author']
    created = bson_data['created']
    description = bson_data['description']
    directions = bson_data['directions']
    name = bson_data['name']
    image = bson_data['image']
    r_id = bson_data['_id']

    ingredients = []
    for ingredient in bson_data['ingredients']:
        ingredients.append(ingredient)

    recipe_obj = Recipe(
        author, created, description, directions, image, ingredients, name)

    recipe_obj.r_id = r_id
    recipe_dict = recipe_obj.to_dict()

    # print('JSON')
    # pprint(recipe_dict)
    return recipe_dict


def jsonify(obj):
    return json.dumps(obj, default=json_util.default)
