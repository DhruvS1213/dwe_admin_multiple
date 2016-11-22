'use strict';

angular.module('dweAdminApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Upload, $window, appConfig, httpService) {
    console.log('admin-view');
    
    var vm = this;
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
    var tempId;
    var flag=0;

    var addOrUpdate = 0;
      //flag to know if content is being added or updated. 0: Adding Content; 1: Updating Content

    var addOrUpdate = 0;      //flag to know if content is being added or updated. 0: Adding Content; 1: Updating Content
    

console.log('testing httpSERvice');   
//console.log(httpService);    
 httpService.getData(function(data){
     console.log(data);
 });
            

angular.element(document).ready(function () {

    console.log('On Page Refresh');
    CKEDITOR.instances.blogTitle.removeAllListeners();
    CKEDITOR.instances.blogData.removeAllListeners();


});

    getContents();

    var demourl = appConfig.url + '/server/temp/'
    console.log('demoURL test', demourl);

    vm.htmlToPlaintext = function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }


    function getContents(){
        console.log('inside getcontents');
        $http.get('/api/contents').success(function(contents) {
            console.log('adding content titles to selectbar');

            
            // for (var i in contents){
            //     if(contents[i].title === undefined){
            //         console.log('No title given');
            //         vm.demos.push('No title added yet');
            //     }
            //     else{
            //         console.log(htmlToPlaintext(contents[i].title));
            //         vm.demos.push(htmlToPlaintext(contents[i].title));
            //     }
            // }

            console.log(vm.demos);      

            console.log(vm.demos);

            vm.contents = contents;

            console.log('vm.contents');
            console.log(vm.contents);
        });
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

    vm.addNewBlog = function() {
        refreshDom();
        addOrUpdate = 0;    // Signifying that new content is being added
        //getContents();
        vm.showContentDiv = true;
        vm.showSelectionDiv = false;
        
        tempId = vm.contents.length + 1;

    }

    vm.selectOption = function() {
        refreshDom();
        //vm.showContentDiv = true;
        console.log('selection changed ... ');
        if(vm.selectedDemo === null){
            console.log('No Demo Selected');
            vm.selectedDemo = 0;
            var index = 1;
        }
        else{
            var index = vm.selectedDemo.demoId;
        }
        
        console.log(index);
        //vm.selectedDemoContent = vm.selectedDemo;
        //vm.selectedDemoId = vm.selectedDemo.demoId;
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
        //vm.showContentDiv = false;
        vm.selectOption();
        //$window.location.reload();
        //vm.showContentDiv = false;
    }

    vm.selected = function(){
        console.log(vm.selectedDemo);

    }




    vm.accordianFunction = function(id){
        if(id == 1)
        {
            vm.showHeading = !vm.showHeading;
            if(vm.showHeading && vm.showTextContent){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showHeading && vm.showImagePart){
                vm.showImagePart = !vm.showImagePart;
            }
            if(vm.showHeading && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 2)
        {
            vm.showTextContent = !vm.showTextContent;
            if(vm.showHeading && vm.showTextContent){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showImagePart){
                vm.showImagePart = !vm.showImagePart;
            }
            if(vm.showTextContent && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 3)
        {
            vm.showImagePart = !vm.showImagePart;
            if(vm.showHeading && vm.showImagePart){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showImagePart){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showImagePart && vm.showVideoPart){
                vm.showVideoPart = !vm.showVideoPart;
            }
        }
        if(id == 4)
        {
            vm.showVideoPart = !vm.showVideoPart;
            if(vm.showHeading && vm.showVideoPart){
                vm.showHeading = !vm.showHeading;
            }
            if(vm.showTextContent && vm.showVideoPart){
                vm.showTextContent = !vm.showTextContent;
            }
            if(vm.showImagePart && vm.showVideoPart){
                vm.showImagePart = !vm.showImagePart;
            }
        }
    };

    vm.uploadTitle = function(head)
    {
       var blogTitle = CKEDITOR.instances.blogTitle.getData();
       var blogData = CKEDITOR.instances.blogData.getData();
       //console.log(blogTitle);
       if(blogData === '' && vm.images.length === 0 && vm.videoPath.length === 0 && addOrUpdate === 0  ){
         $http.post('/api/contents', {demoId: tempId, title: blogTitle}).success(function(res){
                alert("Title Successfully Uploaded");
        });
         //getContents();
       }
       
       else{
          if (addOrUpdate === 0) {
              $http.put('/api/contents/' + vm.contents[tempId - 1]._id, {title: blogTitle}).success(function(res){
                  alert("Data Successfully Uploaded");
              });
          }
          if (addOrUpdate === 1) {
               $http.put('/api/contents/' + vm.selectedDemoContent._id, {title: blogTitle}).success(function(res){
                  alert("Data Successfully Uploaded");
               });
          }
          
        }  
    };

    vm.uploadData = function(head)
    {
       var blogTitle = CKEDITOR.instances.blogTitle.getData();
       var blogData = CKEDITOR.instances.blogData.getData();

       //console.log(blogData);

       if(blogTitle === '' && vm.images.length === 0 && vm.videoPath.length === 0 && addOrUpdate === 0 ){
          
           $http.post('/api/contents', {demoId: tempId, textContent: blogData}).success(function(res){
                alert("Title Successfully Uploaded");
            }); 
            //getContents();
        }
        
        else{
            if( addOrUpdate === 0 ) {
                $http.put('/api/contents/' + vm.contents[tempId - 1]._id, {textContent: blogData}).success(function(res){
                    alert("Data Successfully Uploaded");
                });
            }
            if( addOrUpdate === 1) {
                $http.put('/api/contents/' + vm.selectedDemoContent._id, {textContent: blogData}).success(function(res){
                alert("Data Successfully Uploaded");
            });
            } 
            
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
                    if(blogTitle === '' && vm.blogData === '' && vm.videoPath.length === 0 && addOrUpdate === 0) {
                        
                        $http.post('/api/contents/', {demoId: tempId, imageDetail: vm.imgJSON}).success(function(res){
                             alert("Data Successfully Uploaded");
                        });
                        //vm.imgJSON = [];
                        //getContents();
                    }

                    else{
                        if( addOrUpdate === 0 ){
                            $http.put('/api/contents/' + vm.contents[tempId-1]._id, {imageDetail: vm.imgJSON}).success(function(res){
                                 alert("Data Successfully Uploaded");
                            });
                            //vm.imgJSON = [];
                        }
                        if( addOrUpdate === 1 ){
                            $http.put('/api/contents/' + vm.selectedDemoContent._id, {imageDetail: vm.imgJSON}).success(function(res){
                                alert("Data Successfully Uploaded");
                            });
                            //vm.imgJSON = [];
                        }
                        

                    }


                     
                $http({
                    method: 'GET',
                    url: appConfig.url + '/api/contents'
                }).then(function successCallback(response)
                    {
                        // console.log(response.data[0].imageContent);
                        // var my = response.data[0].imageContent.split(",");
                        // console.log(my);
                        // vm.images= my;
                        // console.log(vm.images);
                        console.log('mylogic',vm.imgJSON);
                        vm.imgJSON = response.data[vm.selectedDemoId].imageDetail;
                        console.log('mylogic2',vm.imgJSON);
                        for(var i in vm.imgJSON){
                             vm.images[i] = vm.imgJSON[i].imagePath;
                             vm.imgDescription[i] = vm.imgJSON[i].imageDescription;
                        }

                    }, function errorCallback(error)
                    {
                        console.log('error');
                    });
                    
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
                    if(blogTitle === '' && blogData === '' && vm.images.length === 0 && addOrUpdate === 0){
                        
                        $http.post('/api/contents/', {demoId: tempId, videoContent: vm.videoPath}).success(function(res){
                             alert("Data Successfully Uploaded");
                        });
                        //getContents();
                    }
                    else{
                        if( addOrUpdate === 0 ){
                            $http.put('/api/contents/' + vm.contents[tempId - 1]._id, {videoContent: vm.videoPath}).success(function(res){
                                alert("Data Successfully Uploaded");
                            });
                        }
                        if ( addOrUpdate === 1 ){
                            $http.put('/api/contents/' + vm.selectedDemoContent._id, {videoContent: vm.videoPath}).success(function(res){
                            alert("Data Successfully Uploaded");
                        });
                        }
                           
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
        
        console.log('json-length', vm.imgJSON);
        
        $http.put('/api/contents/' + vm.selectedDemoContent._id, {imageDetail: vm.imgJSON }).success(function(res){
            alert("Data Successfully Uploaded");
        });
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
        $http.put('/api/contents/' + vm.selectedDemoContent._id, {imageDetail: vm.imgJSON }).success(function(res){
            alert("Image DELETED Successfully");
        });
    }


    vm.removeVideo = function(index){
        console.log('video delete request made');
        console.log(index);
        vm.videoPath = vm.selectedDemoContent.videoContent;
        vm.videoPath.splice(index,1);
        console.log(vm.videoPath)

        $http.put('/api/contents/' + vm.selectedDemoContent._id, {videoContent: vm.videoPath }).success(function(res){
            alert("Video DELETED Successfully");
        });
    }

})