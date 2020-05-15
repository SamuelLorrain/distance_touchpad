var socket = io();
var canvas = document.querySelector('#mouse-canvas');
var debug = document.querySelector('.debug');

var isMoving = false;

canvas.addEventListener('touchstart', function(evt){
    evt.preventDefault();
    if(evt.touches.length === 1){ // left_click
        canvas.ontouchmove = function(evtMove){
            evtMove.preventDefault();
            isMoving = true;
        }
        canvas.ontouchend = function(evtEnd){
            evtEnd.preventDefault();
            if(evtEnd.touches.length === 0 && !isMoving){
                socket.emit('message', 'left_click');
                socket.emit('mouse_click', 'LEFT_CLICK');
            }
            isMoving = false;
        };
    }
    else if(evt.touches.length === 2){ // right_click
        canvas.ontouchend = function(evtEnd){
            evtEnd.preventDefault();
            if(evtEnd.touches.length === 0 && !isMoving){
                socket.emit('message', 'right_click');
                socket.emit('mouse_click', 'RIGHT_CLICK');
            }
            isMoving = false;
        };
    }
    else{
        canvas.ontouchend = null;
    }
});
