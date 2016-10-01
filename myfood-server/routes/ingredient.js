/*
ingredient:      object:
  ingredient_id:    string
  quantity:         float
  measure:          float
*/

var ingredient = function (i, q, m) {
  this.id = i;
  this.quantity = q;
  this.measure = m;
  this.toString = function () {
    var i_str = (
      'ingredient: %s\n  Quantity: %s\n  Amount: %s',
      this.id,
      this.quantity,
      this.measure
    );
    return i_str;
  };
  return this;
};

module.exports = ingredient;
