'use strict';

angular.module('dweAdminApp')
    .factory('httpService', ['$http', '$q', 
        function ($http, $q) {
        
            var baseUrl = 'http://localhost:9000';
            var service = {
                dataRetrieved : [],
                getData: getData,
                sendRequest : sendRequest
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

            function sendRequest ( requestApi ) {
                var def = $q.defer();
                $http.get( baseUrl + requestApi )
                    .success( function ( response )  {
                        def.resolve( response );
                    })
                    .error ( function ( error ) {
                        def.reject( 'Failed' );
                    }) 
                    return def.promise;
            }

    }]);