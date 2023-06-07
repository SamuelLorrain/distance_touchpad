window.onload = () => {
    var socket = io();
    var canvas = document.querySelector('#mouse-canvas');
    var keyboard = document.querySelector('#keyboard');
    var ctrl = document.querySelector('#ctrl');
    var alt = document.querySelector('#alt');
    var tab = document.querySelector('#tab');
    var esc = document.querySelector('#esc');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var isMoving = false;
    var moveAngle = 0;
    var moveDistance = 0;
    var mouseStartX = 0;
    var mouseStartY = 0;
    var mouseX = 0;
    var mouseY = 0;
    var sensibility = .30;
    var isKeyboardFocus = false;

    function calcDistance(){
        moveDistance = Math.sqrt(Math.pow((mouseY - mouseStartY),2) + Math.pow((mouseX - mouseStartX),2)) * sensibility;
        moveAngle = Math.atan((mouseY - mouseStartY) / (mouseX - mouseStartX)) * (180/Math.PI);
        if(moveAngle === -90){
            moveAngle = 0;
        }
        if(mouseX >= mouseStartX && mouseY > mouseStartY){ //upper right
            moveAngle += 90;
        }
        else if(mouseX > mouseStartX && mouseY < mouseStartY){ //lower right
            moveAngle += 90;
        }
        else if(mouseX < mouseStartX && mouseY < mouseStartY){ //upper left
            moveAngle += 180 + 90;
        }
        else if(mouseX < mouseStartX && mouseY > mouseStartY){ //lower left
            moveAngle += 180 + 90;
        }
    }

    function scrollUp(){
        if(mouseStartY < mouseY){
            return true;
        }else{
            return false;
        }
    }

    function getModifiers() {
        return {
            ctrl: ctrl.checked,
            alt: alt.checked
        };
    }

    function disableModifiers() {
        ctrl.checked = false;
        alt.checked = false;
    }

    canvas.addEventListener('touchstart', function(e){
        if (isKeyboardFocus) {
            keyboard.blur();
        }
        e.preventDefault();
        if(e.touches.length === 1){ // left_click
            mouseStartX = e.touches[0].clientX;
            mouseStartY = e.touches[0].clientY;
            canvas.ontouchmove = function(evtMove){ //move
                evtMove.preventDefault();
                isMoving = true;
                mouseX = evtMove.touches[0].clientX;
                mouseY = evtMove.touches[0].clientY;
                calcDistance();
                socket.emit('mouse_move', {type: 'polar',
                                           polar: moveAngle,
                                           distance: moveDistance});
            }
            canvas.ontouchend = function(evtEnd){
                evtEnd.preventDefault();
                if(evtEnd.touches.length === 0 && !isMoving){
                    socket.emit('mouse_click', 'LEFT_CLICK');
                    isMoving = false;
                }
                if(evtEnd.touches.length === 0){
                    isMoving = false;
                }
            };
        }
        else if(e.touches.length === 2){ // right_click
            mouseStartX = e.touches[0].clientX;
            mouseStartY = e.touches[0].clientY;
            canvas.ontouchmove = function(evtScroll){ //scroll
                evtScroll.preventDefault();
                isMoving = true;
                mouseX = evtScroll.touches[0].clientX;
                mouseY = evtScroll.touches[0].clientY;
                calcDistance();
                if(scrollUp()){
                    socket.emit('mouse_click', 'SCROLL_UP');
                } else{
                    socket.emit('mouse_click', 'SCROLL_DOWN');
                }
            }
            canvas.ontouchend = function(evtEnd){
                evtEnd.preventDefault();
                if(evtEnd.touches.length === 0 && !isMoving){
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

    keyboard.addEventListener('focus', function focusKeyboard() {
        isKeyboardFocus = true;
    });

    keyboard.addEventListener('keyup', function triggerKeyboard(e) {
        socket.emit('keyboard_press', {key: e.key, modifier: getModifiers()});
        e.target.value = "";
        disableModifiers();
    });

    tab.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        socket.emit('keyboard_press', {key: 'Tab', modifier: getModifiers()});
        disableModifiers();
    });

    ctrl.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });

    alt.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    });

    esc.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        socket.emit('keyboard_press', {key: 'Escape', modifier: getModifiers()});
        disableModifiers();
    });
};
