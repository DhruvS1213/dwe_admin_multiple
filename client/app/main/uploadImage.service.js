'use strict';

angular.module('dweAdminApp')
    .factory('uploadImageService', ['$http', '$q', 
        function ($http, $q) {
            var baseUrl = 'http://localhost:9000';
            var uploadImageService = {
                dataRetrieved : [],
                postImageDetail : postImageDetail,
                updateImageDetail : updateImageDetail, 
                response : []
            };
            var def = $q.defer();
            return uploadImageService;

            function postImageDetail( requestApi, requestParams ) {
                $http.post( baseUrl + requestApi, { demoId : requestParams.demoId, imageDetail : requestParams.imageDetail } )
                    .success( function( response ) {
                        uploadImageService.response = response;
                        def.resolve( response );
                    })
                    .error( function( error ){
                        def.reject( 'Failed to update content' );
                    })
                return def.promise;
            }

            function updateImageDetail ( requestApi, contentId ,requestParams ) {
                $http.put( baseUrl + requestApi + contentId, {imageDetail: requestParams.imageDetail } )
                  .success( function( response ) {
                        uploadImageService.response = response;
                        def.resolve( response );
                    })
                    .error( function( error ){
                        def.reject( 'Failed to update content' );
                    })
                return def.promise;  
            }
            

                

        }]);