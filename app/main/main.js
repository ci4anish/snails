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
.run(function($rootScope, snailService, $state){
  $rootScope.logOut = function () {
    snailService.authentication.logOut();
    $state.go('login');
  };
})
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('login');
  $stateProvider
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
    .state('todo', {
        url: "/todo",
        templateUrl: "main/templates/todo.html"
      });
});
