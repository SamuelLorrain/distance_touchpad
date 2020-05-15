//mouse buttons
left = document.querySelector('#left-click');
middle = document.querySelector('#middle-click');
right = document.querySelector('#right-click');
scrollUp = document.querySelector('#scroll-up');
scrollDown = document.querySelector('#scroll-down');

//mouse move
mup = document.querySelector('#move-up');
mdown = document.querySelector('#move-down');
mleft = document.querySelector('#move-left');
mright = document.querySelector('#move-right');

var socket = io();
//mouse buttons
left.onclick = function(){
    socket.emit('mouse_click', 'LEFT_CLICK');
};
middle.onclick = function(){
    socket.emit('mouse_click', 'MIDDLE_CLICK');
};
right.onclick = function(){
    socket.emit('mouse_click', 'RIGHT_CLICK');
};
scrollUp.onclick = function(){
    socket.emit('mouse_click', 'SCROLL_UP');
};
scrollDown.onclick = function(){
    socket.emit('mouse_click', 'SCROLL_DOWN');
};

//mouse move
mup.onclick = function(){
    socket.emit('mouse_move', 'MOVE_UP');
};
mdown.onclick = function(){
    socket.emit('mouse_move', 'MOVE_DOWN');
};
mleft.onclick = function(){
    socket.emit('mouse_move', 'MOVE_LEFT');
};
mright.onclick = function(){
    socket.emit('mouse_move', 'MOVE_RIGHT');
};

//canvas
var c = document.getElementById("mouse-canvas");
var ctx = c.getContext("2d");
var centerX =  c.width/2;
var centerY =  c.height/2;
var radius = 20;
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, 2* Math.PI, false);
ctx.fill();
ctx.stroke();

var angleSpan = document.getElementById("angle-value");
var distanceSpan = document.getElementById("distance-value");

var moveAngle = 0;
var moveDistance = 0;

var isMoving = false;

function calcDistance(){
    moveDistance = Math.sqrt(Math.pow((centerY - c.height/2),2) + Math.pow((centerX - c.width/2),2));
    moveAngle = Math.atan((centerY - c.height/2) / (centerX - c.width/2)) * (180/Math.PI);

    if(moveAngle === -90){
        moveAngle = 0;
    }
    if(centerX >= c.width/2 && centerY > c.height/2){ //upper right
        moveAngle += 90;
    }
    else if(centerX > c.width/2 && centerY < c.height/2){ //lower right
        moveAngle += 90;
    }
    else if(centerX < c.width/2 && centerY < c.height/2){ //upper left
        moveAngle += 180 + 90;
    }
    else if(centerX < c.width/2 && centerY > c.height/2){ //lower left
        moveAngle += 180 + 90;
    }

    angleSpan.innerText = moveAngle;
    distanceSpan.innerText = moveDistance;
}
calcDistance();

function drawCircle(){
    ctx.clearRect(0,0, c.width, c.height);
    // arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2* Math.PI, false);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    // hypotenuse
    ctx.beginPath();
    ctx.moveTo(c.width/2, c.height/2);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    //X
    ctx.beginPath();
    ctx.moveTo(c.width/2, c.height/2);
    ctx.lineTo(centerX, c.height/2);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    //Y
    ctx.beginPath();
    ctx.moveTo(centerX, c.height/2);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
}

c.addEventListener('mousedown', function(e){
    e.preventDefault();
    isMoving = true;

    centerX = e.offsetX;
    centerY = e.offsetY;

    calcDistance();
    socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
    drawCircle();
});

c.addEventListener('mousemove', function(e){
    e.preventDefault();
    if(isMoving === true){
        centerX = e.offsetX;
        centerY = e.offsetY;
        calcDistance();
        socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
        drawCircle();
    }
});

c.addEventListener('mouseup', function(e){
    e.preventDefault();
    if(isMoving === true){
        centerX = c.width/2;
        centerY = c.height/2;
        isMoving = false;
        moveAngle = 0;
        moveDistance = 0;
        calcDistance();
        socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
        drawCircle();
    }
});

c.addEventListener('mouseleave', function(e){
    e.preventDefault();
    if(isMoving === true){
        centerX = c.width/2;
        centerY = c.height/2;
        moveAngle = 0;
        moveDistance = 0;
        isMoving = false;
        calcDistance();
        socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
        drawCircle();
    }
});


c.addEventListener('touchstart', function(e){
    e.preventDefault();
    isMoving = true;
    centerX = e.touches[0].clientX;
    centerY = e.touches[0].clientY;
    calcDistance();
    socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
    drawCircle();
});

c.addEventListener('touchmove', function(e){
    e.preventDefault();
    if(isMoving === true){
        centerX = e.touches[0].clientX;
        centerY = e.touches[0].clientY;
        calcDistance();
        socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
        drawCircle();
    }
});

c.addEventListener('touchend', function(e){
    e.preventDefault();
    if(isMoving === true){
        centerX = c.width/2;
        centerY = c.height/2;
        moveAngle = 0;
        moveDistance = 0;
        isMoving = false;
        calcDistance();
        socket.emit('mouse_move', {type: 'polar',  polar: moveAngle, distance: moveDistance});
        drawCircle();
    }
});
