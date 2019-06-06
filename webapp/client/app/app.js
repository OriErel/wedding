var webApp = angular.module('webApp', ['ngAnimate', 'ui.router', 'ngMaterial', 'ngAria', 'LocalStorageModule']);

webApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // Remove default prefix on hashbang
  $locationProvider.hashPrefix('');

  $stateProvider
    .state('root', {
      url: '/:token',
      templateUrl: 'app/root/root.html',
      controller: 'RootCtrl',
    })
    .state('admin', {
      url: '/admin',
      templateUrl: 'app/admin/admin.html',
      controller: 'AdminCtrl',
    });

  $urlRouterProvider.otherwise(function() {
    return '';
  });
});

// TODO remove csv2db, nginx, sms-sender, webapp
