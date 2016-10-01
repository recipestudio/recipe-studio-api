/*
Recipe:           object:
  id:               int [auto]
  name:             string
  ingredients:      object
  picture:          string
  owner:            int [auto] [user_id]
*/

var recipe = function (i, n, g, p, a) {
  this.id = i;
  this.name = n;
  this.ingredients = g;
  this.picture = p;
  this.author = a;
  this.string = function () {
    var r_str = (
      'Recipe: %s\n  Name: %s\n  Ingredients: %s\n  Picture: %s\n  Author: %s\n',
      this.id,
      this.name,
      this.ingredients,
      this.picture,
      this.author
    );
    return r_str;
  };
  return this;
};

module.exports = recipe;
