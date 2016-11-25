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
    vm.imgDescription = [];
    vm.videoPath = [];
    vm.accordion=1;
    vm.imgJSON = [];
    vm.demos = [];
    vm.selectedDemoContent = [];
    vm.showContentDiv = false;
    vm.showSelectionDiv = true;
    vm.feedbackArray = [];
    vm.showLink = 0;
    vm.feedbackLink = '#';

    // Removing all the instances attached to CKEDITORS
    angular.element( document ).ready( function () {
        console.log( 'On Page Refresh' );
        CKEDITOR.instances.blogTitle.removeAllListeners();
        CKEDITOR.instances.blogData.removeAllListeners();
    });
    
    // Fetching contents for the blog data via API
    getContents();

    // Function to download Feedbacks in a CSV File
    vm.getFeedbackArray = function() {
        var defer = $q.defer();
        httpService.getData( '/api/feedbacks' )
            .then(function( feedbacks ) {
                console.log( 'Feedbacks Recieved' );
                defer.resolve(feedbacks);
                for( var i in feedbacks ){
                    // looping through feedbacks to delete id and version field
                    delete feedbacks[ i ][ '_id' ];
                    delete feedbacks[ i ][ '__v' ];
                }
                vm.feedbackArray = feedbacks;
                console.log(vm.feedbackArray);
            }, function( error ){
                console.log('Error in fetching feedbacks');
            });
        return defer.promise;
    }
     
    // Function returns headers for the feedback excel sheet
    vm.getHeader = function(){
        return ["DemoId", "Name", "Email", "Experience" ,"Comments"];
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
        $http.get('/api/contents/'+index).success(function(content){
            vm.selectedDemoContent = content;
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
                vm.videoPath= me;
            }

            // Checking whether image content is added or not
            if(vm.selectedDemoContent.imageDetail === undefined){
                vm.images = [];
                vm.imgDescription = [];
            }
            else{
                vm.imgJSON = vm.selectedDemoContent.imageDetail;
                for(var i in vm.selectedDemoContent.imageDetail){
                    vm.images[i] = vm.imgJSON[i].imagePath;
                    vm.imgDescription[i] = vm.imgJSON[i].imageDescription;
                }
            }
       });
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

    vm.upload = function(file, contentType){
        var contentId;
        Upload.upload({
            url: '/api/contents/imageFile', 
            data:{file:file} 
        }).then(function (resp) { 
            console.log(contentType);
            if(resp.data.error_code === 0){ 
                console.log(resp.config.data.file.name);
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                
                if(contentType === 1)
                {
                    name = resp.config.data.file.name;
                    console.log(demourl + name);
                    vm.images.push(demourl+name);

                    console.log(vm.images);
                    var temp = {};
                    temp['imagePath'] = demourl + name;
                    temp['id'] = vm.images.length-1;
                    temp['imageDescription'] = '';

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

    vm.removeImage = function(index){
        console.log('image requrest to delete')
        console.log(index);
        vm.imgJSON= vm.selectedDemoContent.imageDetail;

        vm.imgJSON.splice(index,1);
        vm.images.splice(index,1);
        vm.imgDescription.splice(index,1);
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
        vm.videoPath = vm.selectedDemoContent.videoContent;
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
        vm.videoPath = [];
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