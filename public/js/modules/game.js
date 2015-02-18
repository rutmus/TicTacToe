angular.module('TicTacToe.game', [])

    .directive('miniTicTacToe', function () {
        return {
            restrict: 'E',
            scope: {
                miniBoard: '='
            },
            templateUrl: 'templates/miniTicTacToe.html',
            replace: true,
            link: function(scope) {

            }
        };
    })

    .factory('GameService', function () {
        return {
            board: new BigBoard(),
            sendPick: sendPick()
        };

        function sendPick(cell) {
            // socket
        }
    })

    .controller('GameCtrl', ['$scope', 'GameService','$localstorage', function ($scope, GameService, $localstorage) {
        var socket = io.connect('http://localhost:8080');

        var connected = $localstorage.getObject('user');
        console.log(connected);

        $scope.$on('$destroy', function() {
            socket.emit('exit', connected.name);
        });

        window.onbeforeunload = function (event) {
            socket.emit('exit', connected.name);
        };

        this.users = [];
        this.waitingToResponse = false;
        this.inGame = false;
        this.requestAccapted = false;
        this.invitedUser = "";
        this.askingUser = undefined;
        this.yourTurn = false;
        this.opponent = "";
        //this.inventions = [];

        var game = this;

        this.sendRequest = function (to) {
            if (to == "yourself"){
                this.yourTurn = true;
            }
            else {
                game.invitedUser = to;

                socket.emit('ask', to, function (result, error) {
                    game.waitingToResponse = result;
                });
            }
        };

        this.declineRequest = function (to) {
            game.askingUser = "";
            socket.emit('decline', {name: to, msg: connected.name + " declined your request"});
        };

        socket.on('usernames', function(data) {
            console.log("users:" + data);
            data.splice(data.indexOf(connected.name), 1 );
            data.unshift("yourself");
            game.users = data;
            $scope.$apply();
        });

        socket.on('declined', function(data) {
            game.waitingToResponse = false;

            // inform the user he was declined
            alert(data);
        });
        
        this.acceptInvite = function () {
            socket.emit('ask', game.askingUser, function(result, error){
                game.waitingToResponse = result;
                game.requestAccapted = result;
            });

            game.askingUser = undefined;
        };

        socket.on('request', function(data) {

            if (!game.waitingToResponse && !game.inGame){
                game.askingUser = data;
                $scope.$apply();
            }
            else if (game.waitingToResponse && game.requestAccapted){
                game.waitingToResponse = false;
                game.requestAccapted = false;

                game.opponent = data;
                game.yourTurn = true;
                game.inGame = true;
                // start game with x - allow all boards
            }
            else if (game.waitingToResponse && data == game.invitedUser) {
                //send 3rd request
                socket.emit('ask', data, function(result, error){
                    if (result){
                        game.opponent = data;
                        game.yourTurn = false;
                        game.inGame = true;
                        game.waitingToResponse = false;
                        //start game with o
                    }
                });
            }
            else {
                //send decline to the asking
                socket.emit('decline', {name: data, msg: " is already in a game"});
            }
        });

        socket.on('game', function(data) {
            game.yourTurn = !game.yourTurn;

            var cell = data.cell;
            var board = data.board;
            var value = data.value;

            game.board.board[board.x][board.y].board[cell.x][cell.y].value = value;

            game.player = value === 'x' ? 'o' : 'x';

            var cell = game.board.board[board.x][board.y].board[cell.x][cell.y];

            if (cell.board.getWinner()) {
                console.log(cell.board.winner);
                game.board.getWinner() ? alert(game.board.getWinner()) : null;
            }

            var boardIsFull = game.board.board[cell.x][cell.y].isFull();

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = boardIsFull;
                });
            });

            game.board.board[cell.x][cell.y].isAlowed = !boardIsFull;

            $scope.$apply();
        });

        socket.emit('newuser', connected, function(result, error){
            console.log(result);

            if (!result){
                // tell the user he wasn't able to connect
                alert("cant connect")
            }
        });

        game.player = 'x';

        game.board = GameService.board;

        game.pick = function(cell) {
            //if (!game.inGame) return;
            if (!game.yourTurn) return;
            if (!cell.board.isAlowed) return;

            cell.value = game.player;
            game.player = game.player === 'x' ? 'o' : 'x';
            //GameService.sendPick(cell);

            if (cell.board.getWinner()) {
                console.log(cell.board.winner);
                game.board.getWinner() ? alert(game.board.getWinner()) : null;
            }

            var boardIsFull = game.board.board[cell.x][cell.y].isFull();

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = boardIsFull;
                });
            });

            game.board.board[cell.x][cell.y].isAlowed = !boardIsFull;

            if (game.inGame) {
                var advance = {
                    name: game.opponent,
                    cell: {x: cell.x, y: cell.y},
                    board: {x: cell.board.x, y: cell.board.y},
                    value: cell.value
                };

                socket.emit('advance', advance, function (result, error) {
                    game.yourTurn = false;
                });
            }
        }
    }]);



function Cell(x, y, board) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.value = undefined;
}

function SmallBoard(x, y) {
    this.x = x;
    this.y = y;
    this.isAlowed = true;
    this.winner = undefined;
    this.board = [];

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new Cell(i, j, this));
        }
    }
}

SmallBoard.prototype.isFull = function () {
    for (var row in this.board) {
        for (var cell in row)
            if (cell.value === undefined) return false;
    }

    return true;
};

SmallBoard.prototype.getWinner = function () {
    var wins = [ [[0,0],[0,1], [0,2]],[[1,0],[1,1], [1,2]],[[2,0],[2,1], [2,2]],
        [[0,0],[1,0], [2,0]],[[0,1],[1,1], [2,1]],[[0,2],[1,2], [2,2]],
        [[0,0],[1,1], [2,2]],[[0,2],[1,1], [2,0]]];

    var that = this;

    if (that.winner) return that.winner;

    wins.forEach(function(win){
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].value === that.board[win[1][0]][win[1][1]].value &&
            that.board[win[0][0]][win[0][1]].value === that.board[win[2][0]][win[2][1]].value &&
            that.board[win[0][0]][win[0][1]].value != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].value;
        }
    });

    return that.winner;
};

function BigBoard() {
    this.board = [];
    this.winner = undefined;

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new SmallBoard(i, j));
        }
    }
}

BigBoard.prototype.getWinner = function () {
    var wins = [ [[0,0],[0,1], [0,2]],[[1,0],[1,1], [1,2]],[[2,0],[2,1], [2,2]],
        [[0,0],[1,0], [2,0]],[[0,1],[1,1], [2,1]],[[0,2],[1,2], [2,2]],
        [[0,0],[1,1], [2,2]],[[0,2],[1,1], [2,0]]];

    var that = this;

    if (that.winner) return that.winner;

    wins.forEach(function(win){
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].winner === that.board[win[1][0]][win[1][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner === that.board[win[2][0]][win[2][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].winner;
        }
    });

    return that.winner;
};

//Square.prototype.fill = function (player) {
//    this.player = player;
//};
//
//function init() {
//    var board = [];
//    for (var i = 0; i < 3; i++) {
//        for (var j = 0; j < 3; j++) {
//            board.push(new Cell(i, j));
//        }
//    }
//
//    return board;
//}