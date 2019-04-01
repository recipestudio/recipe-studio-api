from flask import Flask, make_response
from routes import recipes, ingredients, users
import os

app = Flask(__name__, static_folder=None)
app.config.update({
    'DEBUG': True
})

_PORT = os.getenv('PORT')

app.register_blueprint(recipes.recipe, url_prefix='/recipe')
app.register_blueprint(ingredients.ingredient, url_prefix='/ingredient')
app.register_blueprint(users.user, url_prefix='/user')


@app.route('/')
def index():
    return make_response('hello world', 200)


# Run the thing
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=_PORT)
