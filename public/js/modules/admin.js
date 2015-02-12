angular.module('TicTacToe.statistics', ['uiGmapgoogle-maps'])

    .factory('mapService', ['$http', function ($http) {

        return ({getLocations: getLocations, getUsersPerCountry: getUsersPerCountry});

        function getUsersPerCountry(successCallback, onErrorCallback) {
            $http.get('http://localhost:8080/getUsersPerCountry').success(function(data) {
                console.log(data);
                successCallback(data);
            }).error(onErrorCallback);
        }

        function getLocations(successCallback, onErrorCallback) {
            //$http.get('http://localhost:8080/getAllUsers').success(successCallback).error(onErrorCallback);
            var locations = [];

            var data = ['USA', 'Brazil', 'Denmark'];

            geocoder = new google.maps.Geocoder();

            for (i = 0; i < data.length; i++) {

                //geocoder.geocode({'address': data[i]}, function (results, status) {
                //    if (status == google.maps.GeocoderStatus.OK) {
                //        var info = {
                //            coords: results[0].geometry.location,
                //            text: '5',
                //            id: i
                //        }
                //        locations.push(info);
                //    } else {
                //        console.log("Geocode was not successful for the following reason: " + status);
                //    }
                //});
            }

            return locations;
        }

    }])

    .controller('GraphsCtrl', ['$state', function ($state) {

    }])

    .controller('MapCtrl', ['mapService', function (mapService ) {
        this.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 2 };

        this.locations = [];
        var that = this;

        geocoder = new google.maps.Geocoder();
        mapService.getUsersPerCountry(function(data){

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
                                labelVisible: true
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