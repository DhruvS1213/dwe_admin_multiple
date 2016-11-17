'use strict';

angular.module('dweAdminApp')
	.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});