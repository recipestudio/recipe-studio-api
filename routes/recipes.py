from flask import Blueprint, make_response, jsonify
import json

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


# recipe methods
def get_recipe(id):
    return 'fetched'

def update_recipe(id):
    return 'updated'

def delete_recipe(id):
    return 'deleted'
