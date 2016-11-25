'use strict';

angular.module('dweAdminApp')
    .factory('httpService', ['$http', '$q', 
        function ($http, $q) {
        
            var baseUrl = 'http://localhost:9000';
            var service = {
                dataRetrieved : [],
                getData: getData
            };
            return service;
            
            function getData( requestApi ) {
                var def = $q.defer();
                $http.get( baseUrl + requestApi )
                    .success(function( data ){
                        service.dataRetrieved = data;
                        def.resolve( data );      
                    })
                    .error(function( error ){
                        def.reject( 'Failed to get data' );
                    })
                    return def.promise;
            }

    }]);