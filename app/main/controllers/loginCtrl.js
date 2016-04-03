'use strict';
angular.module('main')
.controller('LoginCtrl', function ($rootScope, $scope, snailService, $timeout, $state) {
  $rootScope.buttonView = false;

	$scope.logIn = function(){
    	snailService.authentication.logIn($scope.user.mail, $scope.user.password).then(function(user) {

        snailService.authentication.getUser(user.uid).then(function(gameUser){
          $rootScope.gameUser = gameUser;
        });

        $timeout(function(){$state.go("searchgame");}, 1000);

        // $state.go("searchgame");
        // $rootScope.gameUser.userId = user.uid;
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
