var app = angular.module('tic-tac-toe', ['ui.router', 'TicTacToe.users', 'TicTacToe.game', 'TicTacToe.statistics', 'mm.foundation'])

//
//window.onbeforeunload = function (event) {
//
// var message = 'Sure you want to leave?';
// if (typeof event == 'undefined') {
// event = window.event;
// }
// if (event) {
// event.returnValue = message;
// }
// return message;
//};

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl as login'
            })

            .state('register',
            {
                url: '/register',
                controller: 'regCtrl as reg',
                templateUrl: 'templates/register.html'
            })

            .state('game',
            {
                url: '/game',
                controller: 'GameCtrl as game',
                templateUrl: 'templates/game.html'
            })

            .state('admin',
            {
                url: '/admin',
                abstract: true,
                templateUrl: 'templates/admin.html'
            })

            .state('admin.userManager', {
                url: '^/manager',
                controller: 'UserManagerCtrl as man',
                templateUrl: 'templates/userManager.html'
            })

            .state('admin.map', {
                url: '^/map',
                controller: 'MapCtrl as mapC',
                templateUrl: 'templates/map.html'
            })

            .state('admin.graph', {
                url: '^/graph',
                controller: 'GraphsCtrl as gra',
                templateUrl: 'templates/graph.html'
            })

            .state('main',
            {
                url: '/main',
                templateUrl: 'templates/main.html'
            });

        $urlRouterProvider.otherwise('/main');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || false);
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }])

    .controller('MainCtrl', ['$localstorage', '$sce', function ($localstorage, $sce) {
        this.isUser = function() {
            if ($localstorage.getObject('user')) {
                return true;
            }
            return false;
        }
    }]);



