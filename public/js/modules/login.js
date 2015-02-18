angular.module('TicTacToe.users', [])

    .factory('loginService', ['$http', '$state', '$window', '$localstorage', function ($http, $state, $window, $localstorage) {

        return ({loginUser: loginUser, saveUser: saveUser, getAllUsers: getAllUsers, setGameResult: setGameResult,
                 blockUser: blockUser, deleteUser: deleteUser });

        function loginUser(user, onErrorCallback) {
            $http.post('http://localhost:8080/checkUser', user).success(successCallback).error(onErrorCallback);
        }

        function saveUser(user, onErrorCallback) {
            $http.post('http://localhost:8080/createUser', user).success(successCallback).error(onErrorCallback);
        }

        function getAllUsers(successCallback, onErrorCallback) {
            $http.get('http://localhost:8080/getAllUsers').success(successCallback).error(onErrorCallback);
        }

        function setGameResult(user, win, successCallback, onErrorCallback) {
            $http.post('http://localhost:8080/setGameResult', {name: user.name, win: win}).success(successCallback).error(onErrorCallback);
        }

        function blockUser(user, successCallback, onErrorCallback) {
            $http.post('http://localhost:8080/blockUser', user).success(successCallback).error(onErrorCallback);
        }

        function deleteUser(user, successCallback, onErrorCallback) {
            $http.post('http://localhost:8080/deleteUser', user).success(successCallback).error(onErrorCallback);
        }

        function successCallback(user){
            if (user){

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

    .controller('UserManagerCtrl', ['loginService', function (loginService) {
        this.users = {};

        this.blockUser = function(user){
            loginService.blockUser(user, function(data){
                console.log(data);
            });
        };

        this.deleteUser = function(user){
            loginService.setGameResult(user, true, function(data){
                console.log(data);
                that.users = data;
            });
        }

        var that = this;

        loginService.getAllUsers(function(data){
            console.log(data);
            that.users = data;
        });

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