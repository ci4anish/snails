'use strict';
angular.module('main')
.controller('GameRoomCtrl', function ($scope, $interval, $rootScope, $timeout, snailService) {
  $rootScope.buttonView = true;
    //Slider with selection bar

    var maxSliderValue = 500;
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

    $scope.firstSnail = {
      value: 0,
      options: sliderOptions
    };

    $scope.secondSnail = {
      value: 0,
      options: sliderOptions
    };

    $scope.thirdSnail = {
      value: 0,
      options: sliderOptions
    };

    var ref = new Firebase("https://snail-game.firebaseio.com/currentPosition");
    ref.on("value", function(snapshot, prevChildKey) {
      var snailsList = snapshot.val();
      $scope.firstSnail.value = snailsList.snail1;
      $scope.secondSnail.value = snailsList.snail2;
      $scope.thirdSnail.value = snailsList.snail3;
    });

    $scope.Math = window.Math;

    $scope.getRandomNumber = function(){
    	if($scope.firstSnail.value < maxSliderValue && $scope.secondSnail.value < maxSliderValue && $scope.thirdSnail.value < maxSliderValue){
    		$scope.firstSnail.value += $scope.Math.floor($scope.Math.random() * (max - min + 1)) + min;
    		$scope.secondSnail.value += $scope.Math.floor($scope.Math.random() * (max - min + 1)) + min;
    		$scope.thirdSnail.value += $scope.Math.floor($scope.Math.random() * (max - min + 1)) + min;
    		ref.set({
    			snail1: $scope.firstSnail.value,
    			snail2: $scope.secondSnail.value,
    			snail3: $scope.thirdSnail.value
    		});
    	}else{
    		alert("Finish!!");
    		$interval.cancel(raceInterval);
    		ref.set({
    			snail1: 0,
    			snail2: 0,
    			snail3: 0
    		});
    	}

    };

    $scope.firstSnailText = false;
    $scope.secondSnailText = false;
    $scope.thirdSnailText = false;

    var raceInterval;
    $scope.start = function(){
      $timeout(function(){$scope.firstSnailText = true;}, 1000);
      $timeout(function(){$scope.firstSnailText = false; $scope.secondSnailText = true;}, 2000);
      $timeout(function(){$scope.secondSnailText = false; $scope.thirdSnailText = true;}, 3000);
      $timeout(function(){
        $scope.thirdSnailText = false; raceInterval = $interval(function(){$scope.getRandomNumber()
      }, 500);}, 4000);
    };

  // snailService.getGame().then(function(gameId){
  //   console.log(gameId);
  // })
});
