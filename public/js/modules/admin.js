angular.module('ticTacToe.admin', [])

    .controller('AdminCtrl', ['$state', function ($state) {
        $state.go('admin.userManager');

        this.changeTab = function(tabName) {
            $state.go('^.' + tabName);
        }
    }])

    .controller('UserManagerCtrl', ['$state', function ($state) {

    }])

    .controller('MapCtrl', ['$state', function ($state) {

    }]);