MOM.mom = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    my.x     = spec.startX;
    my.y     = spec.startY;
    my.size  = spec.size;

    var path = {
        "pathMap": spec.pathMap,
        "next": 0,
        "nextPoint": function() {
            return this.pathMap[this.next];
        },
        "setNewNextPoint": function() {
            if ( this.pathMap.length - 1 > this.next ) {
                this.next = this.next + 1;
            }
            else {
                this.next = 0;
            }
        }
    };

    var checkPath = function() {
        var nextPoint = path.nextPoint();

        if ( nextPoint[0] === my.x && nextPoint[1] === my.y ) {
            path.setNewNextPoint();
        }
    };

    var move = function() {
        var nextPoint = path.nextPoint();

        if ( nextPoint[0] > my.x ) {
            my.x = my.x + 1;
        }
        else if ( nextPoint[0] < my.x ) {
            my.x = my.x - 1;
        }
        else if ( nextPoint[1] > my.y ) {
            my.y = my.y + 1;
        }
        else if ( nextPoint[1] < my.y ) {
            my.y = my.y - 1;
        }

        checkPath(my.x, my.y);
    };

    var isOffscreen = function(x, y) {
        if (
            x + my.size < 0
            || y + my.size < 0
            || x > my.canvas.width
            || y > my.canvas.height
        ) {
            return true;
        }
        return false;
    };

    that.update = function() {
        move();
    };

    that.draw = function(offset) {
        my.context.fillStyle = 'blue';

        var x = my.x + offset[0];
        var y = my.y + offset[1];

        my.context.fillRect( x, y, my.size, my.size);

        return isOffscreen(x, y);
    };

    return that;
};
