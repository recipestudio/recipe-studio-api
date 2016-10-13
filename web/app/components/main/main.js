module.exports = function(){
    return {
        templateUrl:'app/components/main/main.html',
        controller: ['$scope','MainService', function(scope,MainService) {
            scope.state = {
                id:void(0),
                name:void(0),
                ingredients:void(0),
                picture:void(0),
                user:void(0)
            };
            scope.service = new MainService();
        }]
    };
};