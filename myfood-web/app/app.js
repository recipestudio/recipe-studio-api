var angular = require('angular');
require('angular-ui-router');

angular.module('myFoodApp.components', []);
angular.module('myFoodApp.services', []);
// angular.module('myFoodApp.models',[]);
// angular.module('myFoodApp.directives',[]);

angular.module('myFoodApp', ['ui.router','myFoodApp.components','myFoodApp.services'])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        // Transform http request response payload
        $httpProvider.defaults.transformResponse = function(data, headersGetter) {
            var contentType = headersGetter('Content-Type');
            if(data && contentType && (contentType.indexOf('application/json') !== -1 || contentType.indexOf('text/json') !== -1)) {
                var result;
                try{
                    result = JSON.parse(data, function(key, value) {
                        if(value === null) {
                            return '';
                        }
                        return value;
                    });
                }catch(e){
                    result = data;
                }
                return result;
            } else {
                return data;
            }
        };

        $stateProvider
        .state('main', {
            url: '/',
            template: '<main></main>'
        })
    });


require('./components');
require('./services');