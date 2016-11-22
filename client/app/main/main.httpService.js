'use strict';

angular.module('dweAdminApp')
    .factory('httpService', function ($http) {
        var urlBase = 'http://localhost:9000';
        return {
           getData : function (callback) {
              return $http.get(urlBase+'/api/contents').success(callback);
            }
        }

});