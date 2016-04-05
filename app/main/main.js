'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'validation.match',
  'firebase',
  'rzModule'
  // TODO: load other modules selected during generation
])
.run(function($rootScope, snailService, $state, $timeout){
  $rootScope.gameUser = {};

  $rootScope.logOut = function () {
    snailService.authentication.logOut();
    $state.go('login');
  };
})
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('isauth');
  $stateProvider
    .state('isauth', {
      url: "/isauth",
      controller: function($rootScope, snailService, $state, $timeout){
        $rootScope.buttonView = false;
        $rootScope.showSpinner = true;

        snailService.authentication.isAuth()
        .then(function(authData) {
          $rootScope.gameUser.id = authData.uid;

          snailService.authentication.getUser(authData.uid).then(function(gameUser){
            $rootScope.gameUser.name = gameUser.name;
            $rootScope.gameUser.searchingGame = gameUser.searchingGame;

          });

          $timeout(function(){$state.go("searchgame");}, 2000);
        }, function(error) {
          $timeout(function(){$state.go("login");}, 2000);
        });
      }
    })
    .state('gameroom', {
        url: "/gameroom",
        templateUrl: "main/templates/gameroom.html",
        controller: 'GameRoomCtrl'
      })
    .state('login', {
        url: "/login",
        templateUrl: "main/templates/login.html",
        controller: 'LoginCtrl'
      })
    .state('register', {
        url: "/register",
        templateUrl: "main/templates/register.html",
        controller: 'RegisterCtrl'
      })
    .state('searchgame', {
        url: "/searchgame",
        templateUrl: "main/templates/searchgame.html",
        controller: 'SearchGameCtrl'
      })
    .state('profile', {
      url: "/profile",
      templateUrl: "main/templates/profile.html",
      controller: 'ProfileCtrl'
    })
    .state('todo', {
        url: "/todo",
        templateUrl: "main/templates/todo.html"
      });
});
