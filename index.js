var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { exec } = require('child_process');

const LEFT_CLICK = "LEFT_CLICK";
const RIGHT_CLICK = "RIGHT_CLICK";
const MIDDLE_CLICK = "MIDDLE_CLICK";
const SCROLL_UP = "SCROLL_UP";
const SCROLL_DOWN = "SCROLL_DOWN";

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('mouse_click', function(click_type){
        if(click_type === LEFT_CLICK){
            console.log('left click');
            exec('xdotool click 1');
        }
        else if(click_type === RIGHT_CLICK){
            exec('xdotool click 3');
        }else if(click_type === MIDDLE_CLICK){
            exec('xdotool click 2');
        }else if(click_type === SCROLL_UP){
            exec('xdotool click 4 --repeat 2');
        }else if(click_type === SCROLL_DOWN){
            exec('xdotool click 5 --repeat 2');
        }else{
            console.log('unkown mouse click : ' + click_type);
        }
    });


    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
