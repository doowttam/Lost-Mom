MOM.sam = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    my.x     = spec.startX;
    my.y     = spec.startY;
    my.size  = spec.size;
    my.speed = 1;

    var move = function() {
        if ( MOM.key.isDown(MOM.key.codes.LEFT) ) {
            if ( my.x > 0 ) {
                my.x = my.x - my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.RIGHT) ) {
            if ( my.x + my.size < my.canvas.width ) {
                my.x = my.x + my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.UP) ) {
            if ( my.y > 0 ) {
                my.y = my.y - my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.DOWN) ) {
            if ( my.y + my.size < my.canvas.height ) {
                my.y = my.y + my.speed;
            }
        }
    };

    that.update = function() {
        move();
    };

    that.draw = function() {
        my.context.fillStyle = 'black';
        my.context.fillRect(my.x, my.y, my.size, my.size);
    };

    return that;
};
