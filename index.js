var express = require('express');
var app = require('express')();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { exec } = require('child_process');

const LEFT_CLICK   = "LEFT_CLICK";
const RIGHT_CLICK  = "RIGHT_CLICK";
const MIDDLE_CLICK = "MIDDLE_CLICK";
const SCROLL_UP    = "SCROLL_UP";
const SCROLL_DOWN  = "SCROLL_DOWN";

const MOVE_UP    = "MOVE_UP";
const MOVE_DOWN  = "MOVE_DOWN";
const MOVE_LEFT  = "MOVE_LEFT";
const MOVE_RIGHT = "MOVE_RIGHT";

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
    console.log('a user is connected');
    socket.on('message', function(msg){
        console.log('message : ', msg);
    });
    socket.on('mouse_click', function(click_type){
        if(click_type === LEFT_CLICK){
            exec('xdotool click 1');
        } else if(click_type === RIGHT_CLICK){
            exec('xdotool click 3');
        }else if(click_type === MIDDLE_CLICK){
            exec('xdotool click 2');
        }else if(click_type === SCROLL_UP){
            exec('xdotool click 4');
        }else if(click_type === SCROLL_DOWN){
            exec('xdotool click 5');
        }else{
            console.log('unkown mouse click : ' + click_type);
        }
    });

    socket.on('mouse_move', function(move_type){
        if(move_type === MOVE_UP){
            exec('xdotool mousemove_relative -- 0 -5');
        }
        else if(move_type === MOVE_DOWN){
            exec('xdotool mousemove_relative 0 5');
        }
        else if(move_type === MOVE_LEFT){
            exec('xdotool mousemove_relative -- -5 0');
        }
        else if(move_type === MOVE_RIGHT){
            exec('xdotool mousemove_relative 5 0');
        }
        else if(move_type['type'] === 'polar'){
            //console.log('polar : ' + move_type['polar'] + ', distance : ' + move_type['distance']);
            if(move_type['polar'] !== null){
                exec('xdotool mousemove_relative --polar ' + Math.floor(move_type['polar']) + ' ' + Math.floor(move_type['distance']));
            }
        }
        else{
            console.log('unkown mouse move : ' + move_type);
        }
    });

    socket.on('test', function(test){
        console.log(test);
    });

    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
