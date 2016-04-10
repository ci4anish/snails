'use strict';
angular.module('main')
.controller('LoginCtrl', function ($rootScope, $scope, snailService, $timeout, $state) {
  $rootScope.buttonView = false;
  $rootScope.showSpinner = false;

	$scope.logIn = function(){
    	snailService.authentication.logIn($scope.user.mail, $scope.user.password).then(function(user) {

        $rootScope.gameUser.id = user.uid;
        snailService.authentication.getUser(user.uid).then(function(gameUser){

          $rootScope.gameUser.name = gameUser.name;
          $rootScope.gameUser.searchingGame = gameUser.searchingGame;
        });

        $timeout(function(){$state.go("profile");}, 1000);

        $scope.user.mail = "";
        $scope.user.password = "";

      }, function(error) {
        switch (error.code) {
          case "INVALID_EMAIL":
            console.log("The specified user account email is invalid.");
            break;
          case "INVALID_PASSWORD":
            console.log("The specified user account password is incorrect.");
            break;
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            break;
          default:
            console.log("Error logging user in:", error);
        }
      });
    };
});
