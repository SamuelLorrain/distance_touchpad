var socket = io();
var canvas = document.querySelector('#mouse-canvas');
var debug = document.querySelector('.debug');

//canvas.width = document.documentElement.clientWidth;
//canvas.height = document.documentElement.clientHeight;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var isMoving = false;
var moveAngle = 0;
var moveDistance = 0;
var mouseX = 0;
var mouseY = 0;

function calcDistance(){
    moveDistance = Math.sqrt(Math.pow((mouseY - canvas.height/2),2) + Math.pow((mouseX - canvas.width/2),2));
    moveAngle = Math.atan((mouseY - canvas.height/2) / (mouseX - canvas.width/2)) * (180/Math.PI);
    if(moveAngle === -90){
        moveAngle = 0;
    }
    if(mouseX >= canvas.width/2 && mouseY > canvas.height/2){ //upper right
        moveAngle += 90;
    }
    else if(mouseX > canvas.width/2 && mouseY < canvas.height/2){ //lower right
        moveAngle += 90;
    }
    else if(mouseX < canvas.width/2 && mouseY < canvas.height/2){ //upper left
        moveAngle += 180 + 90;
    }
    else if(mouseX < canvas.width/2 && mouseY > canvas.height/2){ //lower left
        moveAngle += 180 + 90;
    }
}

canvas.addEventListener('touchstart', function(evt){
    evt.preventDefault();
    if(evt.touches.length === 1){ // left_click
        canvas.ontouchmove = function(evtMove){ //move
            evtMove.preventDefault();
            isMoving = true;
            mouseX = evtMove.touches[0].clientX;
            mouseY = evtMove.touches[0].clientY;
            calcDistance();
            socket.emit('message', 'mouse_move, polar : ' + moveAngle + ' ' + moveDistance);
            socket.emit('mouse_move', {type: 'polar',
                                       polar: moveAngle,
                                       distance: moveDistance});
        }
        canvas.ontouchend = function(evtEnd){
            evtEnd.preventDefault();
            if(evtEnd.touches.length === 0 && !isMoving){
                socket.emit('message', 'left_click');
                socket.emit('mouse_click', 'LEFT_CLICK');
                isMoving = false;
            }
            if(evtEnd.touches.length === 0){
                isMoving = false;
            }
        };
    }
    else if(evt.touches.length === 2){ // right_click
        canvas.ontouchmove = function(evtScroll){ //scroll
            evtScroll.preventDefault();
            isMoving = true;
            mouseX = evtScroll.touches[0].clientX;
            mouseY = evtScroll.touches[0].clientY;
            calcDistance();
            if(moveAngle < 150){
                socket.emit('mouse_click', 'SCROLL_UP');
            } else{
                socket.emit('mouse_click', 'SCROLL_DOWN');
            }
        }
        canvas.ontouchend = function(evtEnd){
            evtEnd.preventDefault();
            if(evtEnd.touches.length === 0 && !isMoving){
                socket.emit('message', 'right_click');
                socket.emit('mouse_click', 'RIGHT_CLICK');
            }
            if(evtEnd.touches.length === 0){
                isMoving = false;
            }
        };
    }
    else{
        canvas.ontouchend = null;
        canvas.ontouchmove = null;
    }
});
