from flask import Flask, make_response
from routes.recipes import recipe

app = Flask(__name__)
app.config.update({
    'DEBUG': True
})

app.register_blueprint(recipe, url_prefix='/recipe')

@app.route('/')
def index():
    return make_response('hello world', 200)

# Run the thing
if __name__ == '__main__':
    app.run()