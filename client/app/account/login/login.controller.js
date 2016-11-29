'use strict';

angular.module('dweAdminApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, httpService) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/main');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.forgotPassword = function() {
      httpService.sendRequest('/api/contents/forgot/password')
        .then( function ( reponse ) {
          console.log('done');
        });
    }
  });
