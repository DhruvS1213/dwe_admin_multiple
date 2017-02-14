'use strict';

angular.module('dweAdminApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Upload, $window, appConfig, httpService, uploadDataService, uploadVideoService, uploadImageService, $q) {
    console.log('admin-view');
    

    // Temporary variables
    var vm = this;
    var demourl = appConfig.url + '/server/temp/'
    var tempId;
    var flag=0;
    var addOrUpdate = 0;      //flag to know if content is being added or updated. 0: Adding Content; 1: Updating Content
    var requestParams = {
        demoId : '',
        blogContent : '',
        imageDetail : '',
        videoContent : ''
    }
    
    // View-model variables
    vm.selectedBlogId = 0;
    vm.contents = [];
    vm.images = [];
    vm.subImages = [];
    vm.imgDescription = [];
    vm.subImageDescription = [[]];
    vm.subImageLabel = [];
    vm.imgLabel = [];
    vm.videoPath = [];
    vm.accordion=1;
    vm.imgJSON = [];
    vm.subImgJSON = [];
    vm.demos = [];
    vm.selectedDemoContent = [];
    vm.showContentDiv = false;
    vm.showSelectionDiv = true;
    vm.feedbackArray = [];
    vm.troubleArray = [];
    vm.showLink = 0;
    vm.feedbackLink = '#';
    vm.feedbackObject={};
    vm.feedbackObjectDisplay={};
    vm.troubleObject={};
    vm.troubleObjectDisplay={};
    // Removing all the instances attached to CKEDITORS
    angular.element( document ).ready( function () {
        console.log( 'On Page Refresh' );
        CKEDITOR.instances.blogTitle.removeAllListeners();
        CKEDITOR.instances.blogData.removeAllListeners();
    });
    
    // Fetching contents for the blog data via API
    getContents();

    // Function to download Feedbacks in a CSV File
    // vm.getFeedbackArray = function() {
    //     var defer = $q.defer();
    //     $http.get( 'http://localhost:9000/api/feedbacks' )
    //         .then(function( feedbacks ) {
    //             console.log('got my feedbacks',feedbacks);
    //             vm.feedbackObject = feedbacks;
    //             console.log( 'Feedbacks Recieved',vm.feedbackObject );
    //             defer.resolve(feedbacks);
    //             for( var i in feedbacks ){
    //                 // looping through feedbacks to delete id and version field
    //                 delete feedbacks[ i ][ '_id' ];
    //                 delete feedbacks[ i ][ '__v' ];
    //             }
    //             vm.feedbackArray = feedbacks;
    //             console.log('The final Feedback Array',vm.feedbackArray);
    //         }, function( error ){
    //             console.log('Error in fetching feedbacks');
    //         });
    //     return defer.promise;
    // }
     

    $http.get('http://localhost:9000/api/feedbacks').success(function(feedbacks){

        for(var i in feedbacks){
            delete feedbacks[i]['_id'];
            delete feedbacks[i]['__v'];
        }
        console.log('feedbacks');
        console.log(feedbacks);
        vm.feedbackArray = feedbacks;
    });

    // Function returns headers for the feedback excel sheet
    vm.getHeader = function(){
        return ["DemoId", "Feedback Type", "Functionality", "Experience" ,"Comments","TimeStamp"];
    }

     $http.get('http://localhost:9000/api/troubleTickets').success(function(troubleTickets){

        for(var i in troubleTickets){
            delete troubleTickets[i]['_id'];
            delete troubleTickets[i]['__v'];
        }
        console.log('troubleTickets');
        console.log(troubleTickets);
        vm.troubleArray = troubleTickets;
    });

    // Function returns headers for the feedback excel sheet
    vm.getHeaderTrouble = function(){
        return ["DemoId", "Issue", "Functionality" ,"Comments","Time Stamp"];
    }



    vm.htmlToPlaintext = function( text ) {
        return text ? String( text ).replace( /<[^>]+>/gm, '' ) : '';
    }

     vm.addNewBlog = function() {
        refreshDom();
        addOrUpdate = 0;    // Signifying that new content is being added
        vm.showContentDiv = true;
        vm.showSelectionDiv = false;
        tempId = vm.contents.length + 1;
    }

    vm.selectOption = function() {
        refreshDom();
        console.log('selection changed ... ');
        if(vm.selectedDemo === null) {
            console.log('No Demo Selected');
            vm.selectedDemo = 0;
            var index = 1;
        }
        
        else {
            var index = vm.selectedDemo.demoId;
        }
        
        console.log(index);
        $http.get('/api/contents/'+ index).success(function(content){
            vm.selectedDemoContent = content;
            console.log(vm.selectedDemoContent);
            vm.selectedDemoId = vm.selectedDemoContent.demoId;
            console.log('selected demo content');
            console.log(vm.selectedDemoContent);
            console.log(vm.selectedDemoId);

            vm.showContentDiv = true;
            addOrUpdate = 1;
            console.log('add or update status changed to ', addOrUpdate);
            console.log('update mode on...')
            // Checking whether title is added or not
            if(vm.selectedDemoContent.title === undefined){
                vm.title = '';
                CKEDITOR.instances.blogTitle.setData('');
            }
            else{
                console.log('here inside');
                vm.title = vm.selectedDemoContent.title;
                CKEDITOR.instances.blogTitle.setData(vm.title);
                console.log(vm.title);  
            }
            
            //Checking whether text content is added or not
            if(vm.selectedDemoContent.textContent === undefined){
                vm.data = '';
                CKEDITOR.instances.blogData.setData('');
            }
            else{
                vm.data = vm.selectedDemoContent.textContent;  
                CKEDITOR.instances.blogData.setData(vm.data);
            }
            
            // Checking whether video content is added or not
            if(vm.selectedDemoContent.videoContent == undefined || vm.selectedDemoContent.videoContent.length == 0){
                vm.videoPath = [];
            }
            else{
                var me = vm.selectedDemoContent.videoContent.split(",");
                vm.videoPath = me;
                console.log("this is the videoPath",vm.videoPath);
            }

            // Checking whether image content is added or not
            if(vm.selectedDemoContent.imageDetail === undefined){
                vm.images = [];
                vm.imgDescription = [];
                vm.subImageDescription = [];
                vm.subImgLabel = [];
                vm.imgLabel = [];
            }
            else{
                vm.imgJSON = vm.selectedDemoContent.imageDetail;

                for(var i in vm.selectedDemoContent.imageDetail){
                    vm.images[i] = vm.imgJSON[i].imagePath;
                    vm.subImages[i] = vm.imgJSON[i].subImages;
                    
                    vm.imgDescription[i] = vm.imgJSON[i].imageDescription;

                    vm.imgLabel[i] = vm.imgJSON[i].label;
                }
                for(var i in vm.subImages){
                    for(vm.subImageDescription[i] = [];vm.subImageDescription.length < vm.subImages.length; vm.subImageDescription.push([]));
                    for(vm.subImageLabel[i] = [];vm.subImageLabel.length < vm.subImages.length; vm.subImageLabel.push([]));
                    for (var j in vm.subImages[i]){
                        // console.log(i);
                        console.log(i,',',j);
                        console.log(vm.subImages[i][j].subImageDescription);
                        vm.subImageDescription[i][j] = vm.subImages[i][j].subImageDescription;
                        vm.subImageLabel[i][j] = vm.subImages[i][j].subImageLabel
                    }
                }

            }
       });

    for(var i=0;i<vm.feedbackObject.data.length;i++)
       {

            if(vm.feedbackObject.data[i].demoId == index)
            {
            console.log('inside if');    
            vm.feedbackObjectDisplay[i] = vm.feedbackObject.data[i]
            }
       }

        console.log('inside get content for feedback',vm.feedbackObjectDisplay);



   for(var i=0;i<vm.troubleObject.data.length;i++)
       {

            if(vm.troubleObject.data[i].demoId == index)
            {
            console.log('inside if');    
            vm.troubleObjectDisplay[i] = vm.troubleObject.data[i];
            }
       }

        console.log('inside get content for troubleTIcket',vm.troubleObjectDisplay);

    }


    



    vm.submitBlog = function(){
        refreshDom();
        getContents();        
        vm.showSelectionDiv = true;
    }

    vm.selected = function(){
        console.log(vm.selectedDemo);

    }

    vm.uploadTitle = function(head)
    {
        var contentId;
        var blogTitle = CKEDITOR.instances.blogTitle.getData();
        var blogData = CKEDITOR.instances.blogData.getData();
        requestParams.demoId = tempId;
        requestParams.blogContent = blogTitle;

        if(blogData === '' && vm.images.length === 0 && vm.videoPath.length === 0 && addOrUpdate === 0  ){
            uploadDataService.postData( '/api/contents', 'title', requestParams )
                .then( function ( response ) {
                    console.log( 'Title created successfully' );
                    console.log( response );
                }, function ( error ) {
                    console.log( 'Error in creating title' );
                });
         getContents();
       }
       
        else{

            if (addOrUpdate === 0) { contentId = vm.contents[tempId - 1]._id; }
            if (addOrUpdate === 1) { contentId = vm.selectedDemoContent._id; }
            updateBlogData('/api/contents/', contentId, 'title', requestParams);
        }  
    };

    vm.uploadData = function(head)
    {
        var contentId;
        var blogTitle = CKEDITOR.instances.blogTitle.getData();
        var blogData = CKEDITOR.instances.blogData.getData();
        requestParams.demoId = tempId;
        requestParams.blogContent = blogData;

        if(blogTitle === '' && vm.images.length === 0 && vm.videoPath.length === 0 && addOrUpdate === 0 ){
            uploadDataService.postData( '/api/contents', 'textContent', requestParams )
                .then( function ( response ) {
                    console.log( 'Content created successfully' );
                    console.log( response );
                }, function ( error ) {
                    console.log( 'Error in creating content' );
                });
            getContents();
        }
        
        else{
            if (addOrUpdate === 0) { contentId = vm.contents[tempId - 1]._id; }
            if (addOrUpdate === 1) { contentId = vm.selectedDemoContent._id; }
            updateBlogData('/api/contents/', contentId, 'textContent', requestParams);
        }
    };

    vm.submit = function(contentType){
        console.log('submit', contentType);
        vm.imUploadProgress = 0;
        vm.progressText1 = 0;
        if (vm.file) 
        {
            console.log('valid', contentType);
            vm.upload(vm.file, contentType); 
        }
    };

    vm.uploadSubImage = function(imageNumber){
        console.log('uyploadSubImage Request');
        if(vm.subFile){
            console.log('valid');
            console.log('imageNumber', imageNumber, vm.subFile);
            vm.upload(vm.subFile, 3, imageNumber)
        }
    }

   
    vm.upload = function(file, contentType, imageNumber){
        var contentId;
        Upload.upload({
            url: '/api/contents/imageFile', 
            data:{file:file} 
        }).then(function (resp) {
                console.log(contentType);
                if(resp.data.error_code === 0){ 
                    console.log(resp.config.data.file.name);
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                

                    if(contentType === 3) {
                        name = resp.config.data.file.name;
                        console.log(demourl + name);
                        vm.subImages.push(demourl + name);
                        var tempSubImage = {};
                        tempSubImage['subImgPath'] = demourl + name;
                        tempSubImage['imageNumber'] = imageNumber;
                        tempSubImage['subImageDescription'] = '';
                        tempSubImage['subImageLabel'] = '';

                        // vm.subImgJSON.push(tempSubImage);
                        for( var i=0;i<vm.imgJSON.length; i++ ) {
                            if(vm.imgJSON[i].id === imageNumber){
                                if(typeof(vm.imgJSON[i].subImages) === 'undefined'){vm.subImgJSON = [];}
                                else{vm.subImgJSON = vm.imgJSON[i].subImages;}
                                vm.subImgJSON.push(tempSubImage);

                                vm.imgJSON[i].subImages = vm.subImgJSON;
                                console.log(vm.imgJSON[i]);
                                break;
                            }
                        }

                        var blogTitle = CKEDITOR.instances.blogTitle.getData();
                        var blogData = CKEDITOR.instances.blogData.getData();
                        requestParams.demoId = tempId;
                        requestParams.imageDetail = vm.imgJSON;

                        if(blogTitle === '' && blogData === '' && vm.videoPath.length === 0 && addOrUpdate === 0) {
                            console.log( ' image post request' );
                            uploadImageService.postImageDetail ( '/api/contents', requestParams ) 
                                .then( function ( resp ) {
                                    console.log( 'Image uploaded successfully' );
                                    console.log( resp );
                                }, function ( error ) {
                                    console.log( 'error in uploading image' );
                                });
                            getContents();
                        }

                        else{
                            if (addOrUpdate === 0) { contentId = vm.contents[tempId - 1]._id; }
                            if (addOrUpdate === 1) { contentId = vm.selectedDemoContent._id; }
                            updateImageContent('/api/contents/', contentId, requestParams);
                        }

                        // console.log(vm.subImgJSON);
                    }
                    if(contentType === 1){
                        name = resp.config.data.file.name;
                        console.log(demourl + name);
                        vm.images.push(demourl+name);

                        console.log(vm.images);
                        var temp = {};
                        temp['imagePath'] = demourl + name;
                        temp['id'] = vm.images.length-1;
                        temp['imageDescription'] = '';
                        temp['label'] = '';

                        vm.imgJSON.push(temp);
                        console.log('upload function');
                        console.log(vm.imgJSON);
                        
                        var blogTitle = CKEDITOR.instances.blogTitle.getData();
                        var blogData = CKEDITOR.instances.blogData.getData();
                        requestParams.demoId = tempId;
                        requestParams.imageDetail = vm.imgJSON;

                        if(blogTitle === '' && blogData === '' && vm.videoPath.length === 0 && addOrUpdate === 0) {
                            console.log( ' image post request' );
                            uploadImageService.postImageDetail ( '/api/contents', requestParams ) 
                                .then( function ( resp ) {
                                    console.log( 'Image uploaded successfully' );
                                    console.log( resp );
                                }, function ( error ) {
                                    console.log( 'error in uploading image' );
                                });
                            getContents();
                        }

                        else{
                            if (addOrUpdate === 0) { contentId = vm.contents[tempId - 1]._id; }
                            if (addOrUpdate === 1) { contentId = vm.selectedDemoContent._id; }
                            updateImageContent('/api/contents/', contentId, requestParams);
                        }
                    } 

                    if(contentType === 2)
                    {
                        console.log('videoName', resp.config.data.file.name);
                        name = resp.config.data.file.name;
                        console.log(demourl + name);
                        vm.videoPath.push(demourl+name);
                        console.log(vm.videoPath);
                        
                        var blogTitle = CKEDITOR.instances.blogTitle.getData();
                        var blogData = CKEDITOR.instances.blogData.getData();
                        requestParams.demoId = tempId;
                        requestParams.videoContent = vm.videoPath;

                        if(blogTitle === '' && blogData === '' && vm.images.length === 0 && addOrUpdate === 0){
                            uploadVideoService.postVideo ( '/api/contents', requestParams )
                                .then( function ( response ) {
                                    console.log( 'Video uploaded successfully' );
                                    console.log( response );
                                }, function( error ) {
                                    console.log( 'Error in uploading video' );
                            });
                            getContents();
                        }
                        else{
                            if (addOrUpdate === 0) { contentId = vm.contents[tempId - 1]._id; }
                            if (addOrUpdate === 1) { contentId = vm.selectedDemoContent._id; }
                            updateVideoContent('/api/contents/', contentId, requestParams);
                        } 
                        vm.vidUploadProgress = 0;
                        vm.file = '';   
                    }
                } 
                }, function (resp) 
                    { 
                        console.log('Error status: ' + resp.status);
                        $window.alert('Error status: ' + resp.status);
                    }, function (evt) { 
                        
                        if(contentType === 1)
                        {
                            console.log('1');
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            vm.imUploadProgress = progressPercentage;
                            vm.progressText1 = 'progress: ' + progressPercentage + '% ';
                        }

                        if(contentType === 2)
                        {
                            console.log("2");
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            vm.vidUploadProgress = progressPercentage;
                            vm.progressText2 = 'progress: ' + progressPercentage + '% ';
                        }            
                }); 
    };

    vm.addDescription = function(description, index){
        vm.imgJSON= vm.selectedDemoContent.imageDetail;
        console.log(vm.selectedDemoContent.imageDetail);
        for(var i=0; i<vm.imgJSON.length; i++) {
            console.log('Searching if ID Exists');
            flag=0;
            console.log(vm.imgJSON[i].id);
            if(vm.imgJSON[i].id == index)
            {
                flag=1;
                console.log('i',i);
                console.log('id', index);
                console.log('ID Exists');
                vm.imgJSON[i].imageDescription = description;
                break;
            }
        }
        requestParams.imageDetail = vm.imgJSON;
        console.log('json-length', vm.imgJSON);
        updateImageContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );
    }



    vm.addSubImageDetails = function(labelOrDescription, content, imageIndex, subImageIndex){
        vm.imgJSON= vm.selectedDemoContent.imageDetail;

        for(var i=0;i<vm.imgJSON.length; i++){
            if(vm.imgJSON[i].id === imageIndex){
                if(labelOrDescription == 0){
                    vm.imgJSON[i].subImages[subImageIndex].subImageLabel = content;        
                }
                else{
                    vm.imgJSON[i].subImages[subImageIndex].subImageDescription = content;    
                }
                
                break;
            }
        }
        requestParams.imageDetail = vm.imgJSON;
        console.log('json-length', vm.imgJSON); 
        updateImageContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );   
    }



    vm.addLabel = function(label, index){
        vm.imgJSON= vm.selectedDemoContent.imageDetail;
        for(var i=0; i<vm.imgJSON.length; i++) {
            console.log('Searching if ID Exists');
            flag=0;
            console.log(vm.imgJSON[i].id);
            if(vm.imgJSON[i].id == index)
            {
                flag=1;
                console.log('i',i);
                console.log('id', index);
                console.log('ID Exists');
                vm.imgJSON[i].label = label;
                break;
            }
        }
        requestParams.imageDetail = vm.imgJSON;
        console.log('json-length', vm.imgJSON);
        updateImageContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );
    }

    vm.removeSubImage = function(imageIndex, index){
        vm.imgJSON = vm.selectedDemoContent.imageDetail;
        var temp = [];
        for(var i=0;i<vm.imgJSON.length; i++){
            if(vm.imgJSON[i].id === imageIndex) {                
                vm.imgJSON[i].subImages.splice(index, 1);
                vm.subImageDescription[i].splice(index,1);
                vm.subImageLabel[i].splice(index, 1);
                console.log(vm.imgJSON[i].subImages);
                break;
            }
        }
        
        requestParams.imageDetail = vm.imgJSON;
        console.log('json-length', vm.imgJSON);
        updateImageContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );

    }

    vm.removeImage = function(index){
        console.log('image requrest to delete')
        console.log(index);
        vm.imgJSON= vm.selectedDemoContent.imageDetail;

        vm.imgJSON.splice(index,1);
        vm.images.splice(index,1);
        vm.imgDescription.splice(index,1);
        vm.imgLabel.splice(index,1);
        console.log(vm.imgJSON);
        for(var i=index ;i<vm.imgJSON.length; i++){
            vm.imgJSON[i].id  = vm.imgJSON[i].id - 1 ;
            console.log(vm.imgJSON[i].id);
        }

        requestParams.imageDetail = vm.imgJSON;
        console.log('json-length', vm.imgJSON);
        updateImageContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );
    }

    vm.removeVideo = function(index){
        console.log('video delete request made');
        console.log(index);
        console.log("remove video",vm.selectedDemoContent.videoContent);
        vm.videoPath = vm.selectedDemoContent.videoContent.split(",");
        vm.videoPath.splice(index,1);
        console.log(vm.videoPath)
        requestParams.videoContent = vm.videoPath;
        updateVideoContent( '/api/contents/', vm.selectedDemoContent._id, requestParams );
    }

    function refreshDom() {
        vm.title = '';
        CKEDITOR.instances.blogTitle.setData('');
        CKEDITOR.instances.blogData.setData('');
        vm.data = '';
        vm.images = [];
        vm.imgJSON = [];
        vm.imgDescription = [];
        vm.subImageDescription = [];
        vm.subImageLabel = [];
        vm.imgLabel = [];
        vm.videoPath = [];
        vm.feedbackObjectDisplay={};
    }

    function getContents() {
        console.log( 'inside getcontents' );
        uploadDataService.getData( '/api/contents/' )
            .then(function( contents ) {
                if( contents.length === 0 ) {
                    vm.showSelectionDiv = false;
                }
                vm.contents = contents;
                console.log( 'vm.contents' );
                console.log( vm.contents );
           }, function( error ){
                console.log( 'error in fetching contents' );
        });

     $http.get( '/api/feedbacks' )
            .then(function( feedbacks ) {
                vm.feedbackObject = feedbacks;
                console.log('content feedback',vm.feedbackObject);
            }); 

     $http.get( '/api/troubleTickets' )
            .then(function( troubleTickets ) {
                vm.troubleObject = troubleTickets;
                console.log('content trouble',vm.troubleObject);
            }); 
    }


    function updateBlogData ( requestUrl, contentId, blogEntry, requestParams ) {
        uploadDataService.updateContentData( requestUrl, contentId, blogEntry, requestParams )
            .then(function( response ) {
                console.log( 'Title updated successfully' );
                console.log( response );
            }, function( error ){
                console.log( 'Error in updating blog data' );
        });
    }

    function updateImageContent ( requestUrl, contentId, requestParams ) {
        uploadImageService.updateImageDetail ( requestUrl, contentId, requestParams )
            .then( function ( response ) {
                console.log( 'Image details updated successfully' );
                console.log( response );
            }, function( error ){
                console.log( 'Error in updating image details' );
        });
    }

    function updateVideoContent ( requestUrl, contentId, requestParams ) {
        uploadVideoService.updateVideo ( requestUrl, contentId, requestParams )
            .then( function ( response ) {
                console.log( 'Video details updated successfully' );
                console.log( response );
            }, function ( error ) {
                console.log( 'Error in updating video' );
            });
    }
})