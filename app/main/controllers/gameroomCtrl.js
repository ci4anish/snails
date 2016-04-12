'use strict';
angular.module('main')
.controller('GameRoomCtrl', function ($scope, $interval, $rootScope, $timeout, snailService, $ionicModal, $state) {
  $rootScope.buttonView = false;
  $scope.pageLoaded = false;
  $timeout(function(){$scope.pageLoaded = true;}, 800);
  $scope.sayLetsGo = false;
  $scope.introduction = true;

    //Slider with selection bar
    var maxSliderValue = 1000;
    var max = 20;
    var min = 1;
    var sliderOptions = {
      	floor:0,
      	ceil: maxSliderValue,
        showSelectionBar: true,
        readOnly: true,
        getSelectionBarColor: function(value) {
          if(value >= 0) return '#D2D477';
        }
    };

    $scope.gamePlayers = snailService.game.getGame();
    $scope.snails = {};
    $scope.snailsIds = [];

    for(var player in $scope.gamePlayers){
      $scope.snailsIds.push(player);
      $scope.snails[player] = {
        name: $scope.gamePlayers[player].name,
        value: 0,
        showLabel: false,
        options: sliderOptions
      };
    }

    $scope.Math = window.Math;

    $scope.getRandomNumber = function(){
    		return $scope.Math.floor($scope.Math.random() * (max - min + 1)) + min;
    };

    //Update users snail position in database
    var currentVal = 0;
    $scope.move = function(){
      currentVal += $scope.getRandomNumber();
      snailService.game.move(currentVal);
    };

    //Draw snails on inputs first time
    snailService.game.getSnailsPos().then(function(gamers){
      for(var gamer in gamers){
        $scope.snails[gamer].value = gamers[gamer].snailValue;
      }
    });

    //Drawing snails on inputs
    var gameInterval = $interval(function(){
      snailService.game.getSnailsPos().then(function(gamers){
        for(var gamer in gamers){

          if(gamers[gamer].snailValue < 1000){
            $scope.snails[gamer].value = gamers[gamer].snailValue;
          }else{

              $interval.cancel(gameInterval);
              currentVal = 0;
              $rootScope.winner = gamers[gamer].name;

              $scope.openModal();
              snailService.game.removeGame();
              $timeout(function(){
                $state.go('profile');
                $scope.closeModal = function() {
                  $scope.modal.hide();
                };
              }, 3000);
          }
        }
      });
    }, 200);

//intro
  var id, prevId;
  $timeout(function(){
    id = $scope.snailsIds[0];
    $scope.snails[id].showLabel = true;
  }, 1000);
  $timeout(function(){
    prevId = id;
    id = $scope.snailsIds[1];
    $scope.snails[prevId].showLabel = false;
    $scope.snails[id].showLabel = true;
  }, 2000);
  $timeout(function(){
    prevId = id;
    id = $scope.snailsIds[2];
    $scope.snails[prevId].showLabel = false;
    $scope.snails[id].showLabel = true;
  }, 3000);
  $timeout(function(){
    $scope.snails[id].showLabel = false;
    $scope.sayLetsGo = true;
  }, 4000);
  $timeout(function(){
    $scope.sayLetsGo = false;
    $scope.introduction = false;
  }, 5000);

  //modal to show winner
  $ionicModal.fromTemplateUrl('main/templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

});
