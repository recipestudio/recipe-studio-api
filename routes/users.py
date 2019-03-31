from flask import Blueprint, jsonify, make_response, request
import json

user = Blueprint('user_route', __name__)

@user.route('/')
def default():
    return make_response('Malformed request', 400)

# Create user
@user.route('/new', methods=['POST'])
def create_user():
    data = '{}'
    resp = make_response(jsonify(data), 200)
    return resp

# Fetch, update, delete user
@user.route('/<user_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_user(user_id):
    if request.method == 'GET':
        return get_user(user_id)
    elif request.method == 'PUT':
        return update_user(user_id)
    elif request.method == 'DELETE':
        return delete_user(user_id)
    else:
        return make_response('Malformed request', 400)

# user methods
def get_user(id):
    return 'fetched {}'.format(id)

def update_user(id):
    return 'updated {}'.format(id)

def delete_user(id):
    return 'deleted {}'.format(id)