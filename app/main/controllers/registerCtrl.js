'use strict';
angular.module('main')
.controller('RegisterCtrl', function ($scope, $timeout, $state, snailService, $rootScope) {
  $rootScope.buttonView = false;

	$scope.register = function(){
    	snailService.authentication.createUser($scope.user.mail, $scope.user.password, $scope.user.name).then(function(userData) {
        $scope.user.mail = "";
        $scope.user.password = "";
        $scope.user.name = "";
        $scope.user.passwordConfirm = "";
        $timeout(function(){$state.go("login");}, 1000);
      }, function(error) {
        console.log(error);
      });
    };
});
