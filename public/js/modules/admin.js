angular.module('TicTacToe.statistics', ['uiGmapgoogle-maps'])

    .factory('dataService', ['$http', function ($http) {

        return ({getUsersPerCountry: getUsersPerCountry, getUsersPerMonth: getUsersPerMonth});

        function getUsersPerCountry(successCallback, onErrorCallback) {
            $http.get('http://localhost:8080/getUsersPerCountry').success(function(data) {
                console.log(data);
                successCallback(data);
            }).error(onErrorCallback);
        }

        function getUsersPerMonth(successCallback, onErrorCallback) {
            $http.get('http://localhost:8080/getUsersPerMonth').success(function(data) {
                console.log(data);
                successCallback(data);
            }).error(onErrorCallback);
        }

    }])

    .controller('GraphsCtrl', ['$scope','dataService', function ($scope, dataService) {

        this.usersPerMonth = [];

        $scope.$on('$destroy', function() {
            d3.select("svg").remove();
        });

        var that = this;

        this.setGraph = function(){
            d3.select("svg").remove();
            drawGraph(this.selectedYear.monthly)
        }

        dataService.getUsersPerMonth(function(result){
            that.usersPerMonth = result;

            that.selectedYear = result[0];
            that.setGraph();
        });

        function drawGraph(monthly){

            var data = [
                {month: "January", UserRegistered: 0},
                {month: "February", UserRegistered:0},
                {month: "March", UserRegistered: 0},
                {month: "April", UserRegistered: 0},
                {month: "May", UserRegistered: 0},
                {month: "June", UserRegistered: 0},
                {month: "July", UserRegistered: 0},
                {month: "August", UserRegistered: 0},
                {month: "September", UserRegistered: 0},
                {month: "October", UserRegistered: 0},
                {month: "November", UserRegistered: 0},
                {month: "December", UserRegistered: 0}
            ];

            for (i = 0; i <= monthly.length - 1; i++) {
                data[monthly[i].month - 1].UserRegistered += monthly[i].UserRegistered;
            }

            var margin = {top: 40, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var formatPercent = d3.format("d");

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(formatPercent);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>User Registered:</strong> <span style='color:red'>" + d.UserRegistered + "</span>";
                })

            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);

            // The following code was contained in the callback function.
            x.domain(data.map(function(d) { return d.month; }));
            y.domain([0, d3.max(data, function(d) { return d.UserRegistered; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("User Registered");

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.month); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.UserRegistered); })
                .attr("height", function(d) { return height - y(d.UserRegistered); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
        };

    }])

    .controller('MapCtrl', ['dataService', function (dataService ) {
        this.map = {center: {latitude: 40.1451, longitude: -29.6680 }, zoom: 3 };

        this.locations = [];
        var that = this;

        geocoder = new google.maps.Geocoder();
        dataService.getUsersPerCountry(function(data){

            function pushInfo(country, cnt, id){
                geocoder.geocode({'address': country}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var info = {
                            id: id,
                            coords: {
                                latitude: results[0].geometry.location.k,
                                longitude: results[0].geometry.location.D
                            },
                            options: {
                                labelContent: cnt,
                                labelVisible: true,
                                //labelAnchor:"22 0",
                                labelClass:"labels"
                            }
                        }
                        that.locations.push(info);
                    } else {
                        console.log("Geocode was not successful for the following reason: " + status);
                    }
                });
            }

            for (i = 0; i < data.length; i++) {
                pushInfo(data[i]._id, data[i].count, i)
            }
        });

    }]);