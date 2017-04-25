'use strict';

angular.module('dweAdminApp')
    .factory('httpService', ['$http', '$q', 'appConfig',
        function ($http, $q ,appConfig) {
        
            var urlBase = appConfig.url;
            var service = {
                dataRetrieved : [],
                getData: getData
            };
            return service;
            
            function getData() {
                var def = $q.defer();
                $http.get(urlBase+'/api/contents')
                    .success(function(data){
                        service.dataRetrieved = data;
                        def.resolve(data);      
                    })
                    .error(function(error){
                        def.reject('Failed to get data');
                    })
                    return def.promise;
            }
    }]);