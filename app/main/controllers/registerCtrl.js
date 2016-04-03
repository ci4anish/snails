'use strict';
angular.module('main')
.controller('RegisterCtrl', function ($scope, snailService) {
	$scope.register = function(){
    	snailService.authentication.createUser($scope.user.mail, $scope.user.password, $scope.user.name);
    	$scope.user.mail = "";
    	$scope.user.password = "";
    	$scope.user.name = "";
    	$scope.user.passwordConfirm = "";

    	// $state.go('gameroom');
    };
});
