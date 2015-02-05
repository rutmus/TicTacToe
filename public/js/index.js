var app = angular.module('tic-tac-toe', ['ngRoute']);

//
//window.onbeforeunload = function (event) {
//
//    var message = 'Sure you want to leave?';
//    if (typeof event == 'undefined') {
//        event = window.event;
//    }
//    if (event) {
//        event.returnValue = message;
//    }
//    return message;
//};

app.config(function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
        .when('/login',
        {
            controller: 'loginCtrl',
            templateUrl: 'templates/login.html',
            controllerAs: 'login'
        })
        .when('/register',
        {
            controller: 'regCtrl',
            templateUrl: 'templates/register.html',
            controllerAs: 'reg'
        })
        //.when('/game',
        //{
        //    controller: 'regCtrl',
        //    templateUrl: 'templates/register.html',
        //    controllerAs: 'reg'
        //})
        .when('/main',
        {
            templateUrl: 'templates/main.html'
        })
        .otherwise(
        {
            controller: 'loginCtrl',
            templateUrl: 'templates/login.html',
            controllerAs: 'login'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.factory('loginService', ['$http', '$location', '$window', function ($http, $location, $window) {

    return ({loginUser: loginUser, saveUser: saveUser, connectedUser: connectedUser});

    var connectedUser;

    var onBeforeUnloadHandler = function (event){

        if (connectedUser) {
            (event || $window.event).returnValue = message;
            return message;
        } else {
            return undefined;
        }

        //var message = 'Sure you want to leave? ' + loginService.connectedUser.user;
        //if (typeof event == 'undefined') {
        //    event = $window.event;
        //}
        //if (event) {
        //    event.returnValue = message;
        //}
        //return message;
    };

    if ($window.addEventListener) {
        $window.addEventListener('beforeunload', onBeforeUnloadHandler);
    } else {
        $window.onbeforeunload = onBeforeUnloadHandler;
    }

    function loginUser(user, onErrorCallback) {
        $http.post('http://localhost:8080/checkUser', user).success(successCallback).error(onErrorCallback);
    }

    function saveUser(user, onErrorCallback) {
        $http.post('http://localhost:8080/createUser', user).success(successCallback).error(onErrorCallback);
    }

    function successCallback(user){
        if (user){
            connectedUser = user;
            $location.path('/main');
            alert(user.name + ' is ' + user.online);
            //$http.get('http://ipinfo.io/json').success(function(data){
            //    alert(data.country + data.city)
            //});
        }
    }
}]);

app.controller('loginCtrl', ['loginService', function (loginService) {
    var that = this;

    this.submit = function () {
        loginService.loginUser(this.user, function(err){
            that.message = err.message;
        });
    };
}])
.controller('regCtrl', ['loginService', function (loginService) {
    var that = this;

    this.submit = function () {
        loginService.saveUser(this.user, function(err){
            that.message1 = '';
            that.message2 = '';

            if (err.message.indexOf("Username") > -1){
                that.message1 = err.message;
            }

            if (err.message.indexOf("Mail") > -1){
                that.message2 = err.message;
            }
        });
    };
}]);