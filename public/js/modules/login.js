angular.module('ticTacToe.login', [])

    .factory('loginService', ['$http', '$state', '$window', '$localstorage', function ($http, $state, $window, $localstorage) {

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
                //alert(user.name + ' is ' + user.online);
                $localstorage.setObject('user', user);
                if (user.admin) {
                    $state.go('admin');
                }
                else {
                    $state.go('game');
                }
            }
        }
    }])

    .controller('loginCtrl', ['loginService', function (loginService) {
        var that = this;

        this.submit = function () {
            loginService.loginUser(this.user, function(err){
                that.message = err.message;
            });
        };
    }])

    .controller('regCtrl', ['loginService', '$http', function (loginService, $http) {
        this.user = {};
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

        $http.get('http://ipinfo.io/json').
            success(function(data) {
                console.log(data);
                that.user.country = data.country;
            });
    }]);