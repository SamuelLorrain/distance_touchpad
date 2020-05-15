var socket = io();
var canvas = document.querySelector('#mouse-canvas');
var debug = document.querySelector('.debug');

canvas.addEventListener('touchstart', function(evt){
    if(evt.touches.length === 1){ //single click
        canvas.ontouchend = function(evtEnd){
            if(evtEnd.touches.length === 0){
                socket.emit('message', 'left_click');
                socket.emit('mouse_click', 'LEFT_CLICK');
            }
        };
    }
    else if(evt.touches.length === 2){ //secondary
        canvas.ontouchend = function(evtEnd){
            if(evtEnd.touches.length === 0){
                socket.emit('message', 'right_click');
                socket.emit('mouse_click', 'RIGHT_CLICK');
            }
        };
    }
    else{
        canvas.ontouchend = null;
    }
});
