angular.module('TicTacToe.users', [])

    .factory('loginService', ['$http', '$state', '$rootScope', '$localstorage', function ($http, $state, $rootScope, $localstorage) {

        return ({loginUser: loginUser, saveUser: saveUser });

        function loginUser(user, onErrorCallback) {
            $http.post('http://localhost:8080/checkUser', user).success(successCallback).error(onErrorCallback);
        }

        function saveUser(user, onErrorCallback) {
            $http.post('http://localhost:8080/createUser', user).success(successCallback).error(onErrorCallback);
        }

        function successCallback(user){
            if (user){
                $rootScope.loggedUser = user;
                $localstorage.setObject('user', user);
                $state.go('main');
            }
        }
    }])

    .factory('userService', ['$http', function ($http) {

        return ({getAllUsers: getAllUsers, setGameResult: setGameResult, blockUser: blockUser, deleteUser: deleteUser });

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
    }])

    .controller('UserManagerCtrl', ['userService', function (userService) {
        this.users = {};

        this.blockUser = function(user){
            userService.blockUser(user, function(data){
                console.log(data);
            });
        };

        this.deleteUser = function(user){
            this.users.splice(this.users.indexOf(user), 1);
            userService.deleteUser(user, function(data){
                console.log(data);
            });
        };

        var that = this;

        userService.getAllUsers(function(data){
            console.log(data);
            that.users = data;
        });

    }])

    .controller('UserDetailsCtrl', ['userService', '$rootScope', '$state', '$localstorage', function (userService, $rootScope, $state, $localstorage) {

        this.signUserOut = function() {
            $localstorage.remove('user');
            $rootScope.loggedUser = null;

            $state.go('main');
        };

        this.deleteUser = function(){
            userService.deleteUser($rootScope.loggedUser);
            this.signUserOut();
        };

        //drawGraph();

        function drawGraph() {

            // cleaning the last graph
            d3.select("svg").remove();

            var data = [
                {key: "Wins", value: 6},
                {key: "Losses", value:4}
            ];

            var width = 960,
                height = 500,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.ordinal()
                .range(["#98abc5", "#8a89a6"]);

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 70);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.population;
                });

            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


            data.forEach(function(d) {
                d.population = +d.value;
            });

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .attr("d", arc)
                .style("fill", function (d) {
                    return color(d.data.key);
                });

            g.append("text")
                .attr("transform", function (d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.data.key;
                });

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