/**
 * Created by רותם on 07/01/2015.
 */

var express = require('express')
    , path = require('path')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(8080);

mongoose.connect('mongodb://localhost/TicTacToe');

var userSchema = mongoose.Schema({
    name: String,
    password: String,
    mail: String,
    online: Boolean,
    admin: Boolean
}, { collection: 'users'});

var User = mongoose.model('User', userSchema);

var users = {};

io.sockets.on('connection', function (socket) {
    io.sockets.emit('this', { will: 'be received by everyone'});

    socket.on('message', function (data) {
        console.log('New Chat Message ', data);
        io.sockets.emit('txt',{msg: data, nick: socket.username});
    });

    socket.on('advance', function (data) {
        console.log('New move to ', data.name);
        users[data.name].emit('game',{x: data.x, y: data.y});
    });

    socket.on('ask', function (data) {
        console.log('New request from ', data);
        users[data].emit('request',socket.username);
    });

    socket.on('newuser', function (data, callback) {
        User.findOne(data, function (err, user){
            if (user) {
                socket.username = data.name;
                users[data.name] = socket;

                console.log(data.name,' Is Now Connected!');
                //io.sockets.emit('log',data.name + ' is now online');
                //io.sockets.emit('log', data.name);
                io.sockets.emit('usernames', Object.keys(users));

                callback(true);
            }
            else {
                callback(false);
            }
        })

        //socket.username = name;
        //usernames[name] = name;
        //socket.emit('updatechat', 'SERVER', 'you have connected');
        //socket.broadcast.emit('updatechat', 'SERVER', name + ' has connected');
        //io.sockets.emit('updateusers', usernames);

        //console.log(name,' Is Now Connected!');
        //io.sockets.emit('txt',name + ' is now online');
    });

    socket.on('exit', function (data) {
        if (!socket.username) return;

        delete users[socket.username];
        console.log(socket.username,' Has Been Disconnected!');
        io.sockets.emit('log',socket.username + ' is now offline');
    });

});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname , 'public')));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/checkUser", function(req, res) {
    var userToCheck = User(req.body);
    User.findOne({'name' : req.body.name, 'password' : req.body.password}, function (err, user){
        if (user) {
            console.log(user.name + " has logged in");
            user.online = true;
            res.json(user);
        }
        else {
            console.log('sign in attempt failed');
            res.json(500, { message: 'User or password are incorrect' });
        }
    })
});

app.post("/createUser", function(req, res) {
    User.findOne({'name' : req.body.name}, function (err, user){
        if (user) {
            console.log(user.name + " already exists");
            res.json(500, { message: 'Username already exists' });
        }
        else
        {
            User.findOne({'mail' : req.body.mail}, function (err, user) {
                if (user) {
                    console.log(user.mail + " in use");
                    res.json(500, { message: 'Mail is already in use' });
                }
                else {
                    var newUser = User(req.body);
                    newUser.online = true;
                    newUser.admin = false;
                    newUser.save();
                    console.log(newUser.name + " has created");
                    res.json(newUser);
                }
            });
        }
    });
});

//app.listen(8080);