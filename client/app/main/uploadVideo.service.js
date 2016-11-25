'use strict';

angular.module('dweAdminApp')
    .factory('uploadVideoService', ['$http', '$q', 
        function ($http, $q) {
        
            var baseUrl = 'http://localhost:9000';
            var uploadVideo = {
                dataRetrieved : [],
                postVideo : postVideo,
                updateVideo : updateVideo,
                response : []
            };
            var def = $q.defer();
            return uploadVideo;

            function postVideo( requestApi, requestParams ) {
                $http.post( baseUrl + requestApi, { demoId : requestParams.demoId, videoContent : requestParams.videoContent } )
                    .success( function( response ) {
                        uploadVideo.response = response;
                        def.resolve( response );
                    })
                    .error( function( error ){
                        def.reject( 'Failed to update content' );
                    })
                return def.promise;
            }

            function updateVideo ( requestApi, contentId ,requestParams ) {
                $http.put( baseUrl + requestApi + contentId, {videoContent: requestParams.videoContent } )
                  .success( function( response ) {
                        uploadVideo.response = response;
                        def.resolve( response );
                    })
                    .error( function( error ){
                        def.reject( 'Failed to update content' );
                    })
                return def.promise;  
            }


        }]);