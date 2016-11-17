'use strict';

angular.module('dweAdminApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, Upload, $window) {
    console.log(Auth.getCurrentUser().name);
    
    console.log('admin-view');
    getContents();
    var vm = this;
     vm.selectedBlogId = 0;
    vm.contents = [];
    vm.images = [];
    vm.imgDescription = [];
    vm.videoPath = [];
    vm.accordion=1;
    vm.imgJSON = [];
    vm.demos = [];
    // console.log(vm.imgJSON);
    var flag=0;

    var demourl = 'http://localhost:9000/server/temp/'

    function htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }


    function getContents(){
       console.log('inside getcontents');
      console.log('id', vm.selectedBlogId);
      $http.get('/api/contents').success(function(contents) {
      
      //retrieving content titles
      for (var i in contents){
        if(contents[i].title === undefined){
            console.log('No title given');
        }
        else{
            console.log(htmlToPlaintext(contents[i].title));
            vm.demos.push(htmlToPlaintext(contents[i].title));
        }
      }

      vm.contents = contents;
      console.log('vm.contents');
      console.log(vm.contents);

      // Checking whether any entry exists in mongod
      if(vm.contents.length != 0){
        
        // Checking whether title is added or not
        if(vm.contents[0].title === undefined){
          vm.title = '';
        }
        else{
          vm.title = vm.contents[0].title;  
        }
        
        //Checking whether text content is added or not
        if(vm.contents[0].textContent === undefined){
          vm.data = '';
        }
        else{
          vm.data = vm.contents[0].textContent;  
        }
        
        // Checking whether video content is added or not
        if(vm.contents[0].videoContent == undefined || vm.contents[0].videoContent.length == 0){
           vm.videoPath = [];
        }
        else{
          var me = vm.contents[0].videoContent.split(",");
          vm.videoPath= me;
        }

        // Checking whether image content is added or not
        if(vm.contents[0].imageDetail === undefined){
          vm.images = [];
          vm.imgDescription = [];
        }
        else{
          vm.imgJSON = vm.contents[0].imageDetail;
          for(var i in vm.contents[0].imageDetail){
              vm.images[i] = vm.imgJSON[i].imagePath;
              vm.imgDescription[i] = vm.imgJSON[i].imageDescription;
          }
        }
      }
   });
}

    vm.addNewBlog = function(){
        console.log(vm.title);
        vm.title = '';
        CKEDITOR.instances.blogTitle.setData('');
        CKEDITOR.instances.blogData.setData('');
        console.log(vm.title);
        vm.data = '';
        vm.images = [];
        vm.imgDescription = [];
        vm.videoPath = [];
        
        var tempId = vm.contents.length+1;
         $http.post('/api/contents', {demoId: tempId}).success(function(res){
                alert("ID for new blog created !!");
        });
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
       console.log(blogTitle);
       
       if(vm.contents.length == 0){
         $http.post('/api/contents', {title: blogTitle}).success(function(res){
                alert("Title Successfully Uploaded");
        });
         getContents();
       }
       
       else{
          $http.put('/api/contents/' + vm.contents[0]._id, {title: blogTitle}).success(function(res){
                  alert("Data Successfully Uploaded");
          });
        }  
    };

    vm.uploadData = function(head)
    {
       var blogData = CKEDITOR.instances.blogData.getData();
       console.log(blogData);
       if(vm.contents.length == 0){
           $http.post('/api/contents', {textContent: blogData}).success(function(res){
                alert("Title Successfully Uploaded");
            }); 
            getContents();
        }


       else{
          $http.put('/api/contents/' + vm.contents[0]._id, {textContent: blogData}).success(function(res){
          alert("Data Successfully Uploaded");
        });
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

                    if(vm.contents.length === 0){
                        $http.post('/api/contents/', {imageDetail: vm.imgJSON}).success(function(res){
                             alert("Data Successfully Uploaded");
                        });
                        getContents();
                    }
                    else{
                        $http.put('/api/contents/' + vm.contents[0]._id, {imageDetail: vm.imgJSON}).success(function(res){
                             alert("Data Successfully Uploaded");
                        });

                    }


                     
                $http({
                    method: 'GET',
                    url: 'http://localhost:9000/api/contents'
                }).then(function successCallback(response)
                    {
                        // console.log(response.data[0].imageContent);
                        // var my = response.data[0].imageContent.split(",");
                        // console.log(my);
                        // vm.images= my;
                        // console.log(vm.images);
                        console.log('mylogic',vm.imgJSON);
                        vm.imgJSON = response.data[0].imageDetail;
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

                    if(vm.contents.length === 0){
                        $http.post('/api/contents/', {videoContent: vm.videoPath}).success(function(res){
                             alert("Data Successfully Uploaded");
                        });
                        getContents();
                    }
                    else{
                        $http.put('/api/contents/' + vm.contents[0]._id, {videoContent: vm.videoPath}).success(function(res){
                            alert("Data Successfully Uploaded");
                        });   
                    }   
                     
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
        
            $http({
                    method: 'GET',
                    url: 'http://localhost:9000/api/contents'
                }).then(function successCallback(response)
                    {
                        console.log(response.data[0].imgDescription);
                     
                        vm.imgJSON= response.data[0].imageDetail;




        console.log('index', index);
        console.log('description', description)

        console.log('id', vm.imgJSON[0].id);
        //vm.imgDescription[index] = description;
       //vm.imgDescription[index] = vm.images[index] + '.txt';
     // var tempItem = {};
       
     
     
       
            for(var i=0; i<vm.imgJSON.length; i++){
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
           
          //  vm.imgJSON[].imageDescription = description;

                
                
                
                // if(flag == 0 )
                // {
                //     console.log('flag', flag);
                //     console.log('ID Not found. Creating new');
                    
                //     console.log('i',i);
                //     console.log('id', index);
                //     tempItem['id'] = index;
                //     tempItem['imageDescription'] = description;
                //     vm.imgJSON.push(tempItem);
                // }
            
       
    
       console.log('json-length', vm.imgJSON);

        
        // console.log(vm.imgDescription);
        // for (desc in vm.imgDescription){
        //     console.log(desc + ':' + vm.imgDescription[desc]);
        // }

        // $http({
        //     method: 'GET',
        //     url: 'http://localhost:3000/uploadImageDescription?imgDescription=' + vm.imgDescription 
        // });
        //console.log('Descriptions', vm.desription);
      

                    $http.put('/api/contents/' + vm.contents[0]._id, {imageDetail: vm.imgJSON }).success(function(res){
                         alert("Data Successfully Uploaded");
                    });


                       
                    }, function errorCallback(error)
                    {
                        console.log('error');
                    });
        }



 vm.removeImage = function(index){
    console.log('image requrest to delete')
    console.log(index);

    vm.imgJSON.splice(index,1);
    vm.images.splice(index,1);
    vm.imgDescription.splice(index,1);
    console.log(vm.imgJSON);
    for(var i=index ;i<vm.imgJSON.length; i++){
        vm.imgJSON[i].id  = vm.imgJSON[i].id - 1 ;
        console.log(vm.imgJSON[i].id);
    }
         $http.put('/api/contents/' + vm.contents[0]._id, {imageDetail: vm.imgJSON }).success(function(res){
            alert("Image DELETED Successfully");
            
         });



 }


 vm.removeVideo = function(index){
  console.log('video delete request made');
  console.log(index);

  vm.videoPath.splice(index,1);
  console.log(vm.videoPath)

  $http.put('/api/contents/' + vm.contents[0]._id, {videoContent: vm.videoPath }).success(function(res){
            alert("Video DELETED Successfully");
            
         });
 }



})