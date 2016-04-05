'use strict';
angular.module('main')
.controller('SearchGameCtrl', function ($scope, snailService, $rootScope) {
  $rootScope.buttonView = true;
  $rootScope.showSpinner = false;

  // snailService.checkForPlayers()

  $scope.searchGame = function(){

    snailService.checkForPlayers($rootScope.gameUser.id);
  }
});
