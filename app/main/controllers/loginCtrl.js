'use strict';
angular.module('main')
.controller('LoginCtrl', function ($scope, snailService, $timeout, $state) {

	$scope.logIn = function(){
    	var a = snailService.authentication.logIn($scope.user.mail, $scope.user.password);
    	$scope.user.mail = "";
    	$scope.user.password = "";

    	// $timeout(function(){console.log("a: ", a)}, 2000)
    	// $state.go('gameroom');
    };
});
