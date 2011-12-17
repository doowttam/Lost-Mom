MOM.sam = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    my.x     = spec.startX;
    my.y     = spec.startY;
    my.size  = spec.size;
    my.speed = 1;
    my.map   = spec.map;

    var move = function() {
        if ( MOM.key.isDown(MOM.key.codes.LEFT) ) {
            if ( my.x  - (my.size / 2) > 0 ) {
                my.x = my.x - my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.RIGHT) ) {
            if ( my.x + (my.size / 2 ) < my.map.width ) {
                my.x = my.x + my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.UP) ) {
            if ( my.y - (my.size / 2) > 0 ) {
                my.y = my.y - my.speed;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.DOWN) ) {
            if ( my.y + (my.size / 2) < my.map.height ) {
                my.y = my.y + my.speed;
            }
        }
    };

    that.update = function() {
        move();
    };

    that.draw = function() {
        my.map.draw(my.x, my.y);

        my.context.fillStyle = 'orange';
        my.context.fillRect( ( my.canvas.width - my.size ) / 2, ( my.canvas.height - my.size ) / 2, my.size, my.size);
    };

    return that;
};
