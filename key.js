// Pulled from http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
MOM.key = function() {
    var that = {};

    var pressed = {};

    that.codes = {
        "LEFT": 37,
        "UP": 38,
        "RIGHT": 39,
        "DOWN": 40
    };

    that.isDown = function(keyCode) {
        return pressed[keyCode];
    };

    that.onKeyDown = function(event) {
        pressed[event.keyCode] = true;
    };

    that.onKeyUp = function(event) {
        delete pressed[event.keyCode];
    };

    return that;
}();