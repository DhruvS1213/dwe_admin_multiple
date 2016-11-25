'use strict';

angular.module('dweAdminApp')
    .factory('uploadDataService', ['$http', '$q', 
        function ($http, $q) {
        
            var baseUrl = 'http://localhost:9000';
            var dataService = {
                dataRetrieved : [],
                getData: getData,
                postData: postData,
                updateContentData : updateContentData,
                response : []
            };
            return dataService;
            
            function getData( requestApi ) {
                var def = $q.defer();
                $http.get( baseUrl + requestApi )
                    .success(function( data ){
                        dataService.dataRetrieved = data;
                        def.resolve( data );      
                    })
                    .error(function( error ){
                        def.reject( 'Failed to get data' );
                    })
                    return def.promise;
            }

            function postData( requestApi, blogEntry, requestParams ) {
                var def = $q.defer();
                if( blogEntry === 'title' ) {
                    $http.post( baseUrl + requestApi, { demoId : requestParams.demoId, title: requestParams.blogContent } )
                        .success( function( response ) {
                            dataService.response = response;
                            def.resolve( response );
                        })
                        .error( function( error ){
                            def.reject( 'Failed to update content' );
                        })
                    return def.promise;
                }

                if( blogEntry === 'textContent' ) {
                    $http.post( baseUrl + requestApi, { demoId : requestParams.demoId, textContent: requestParams.blogContent } )
                        .success( function( response ) {
                            dataService.response = response;
                            def.resolve( response );
                        })
                        .error( function( error ){
                            def.reject( 'Failed to update content' );
                        })
                    return def.promise;
                }
            }

            function updateContentData( requestApi, contentId, blogEntry, requestParams ) {
                var def = $q.defer();
                if ( blogEntry === 'title') {
                    $http.put( baseUrl + requestApi + contentId, {title: requestParams.blogContent } )
                    .success( function( response ) {
                            dataService.response = response;
                            def.resolve( response );
                        })
                        .error( function( error ){
                            def.reject( 'Failed to update content' );
                        })
                    return def.promise;
                }                 
                
                if ( blogEntry === 'textContent') {
                    $http.put( baseUrl + requestApi + contentId, {textContent: requestParams.blogContent } )
                    .success( function( response ) {
                            dataService.response = response;
                            def.resolve( response );
                        })
                        .error( function( error ){
                            def.reject( 'Failed to update content' );
                        })
                    return def.promise;
                }  
            }
    }]);