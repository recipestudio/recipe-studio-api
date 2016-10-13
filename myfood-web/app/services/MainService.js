module.exports = ['$q','$http',function($q,$http) {
    var Service = function() {
        this.endpoint='http://104.236.228.50:3000/';
    };

    Service.prototype.createRecipe = function(params) {
        console.log(params);
        var _this = this;
        return $q(function(resolve,reject) {
            $http.post(_this.endpoint+'recipe/new', params).then(function(payload) {
                resolve(payload);
            }, function(err) {
                reject(err);
            });
        });
    };

    return Service;
}];