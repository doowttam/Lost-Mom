MOM.sam = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    my.x     = spec.startX;
    my.y     = spec.startY;
    my.size  = spec.size;
    my.map   = spec.map;

    var frame = 1;

    var moving = false;

    var move = function() {
        moving = false;

        var topLeftX = ( my.canvas.width - my.size ) / 2;
        var topLeftY = ( my.canvas.height - my.size ) / 2;

        if ( MOM.key.isDown(MOM.key.codes.LEFT) ) {
            if ( my.map.canMoveLeft(topLeftX, topLeftY, my.size) ) {
                my.x = my.x - 1;
                moving = true;
            }
       } 
        if ( MOM.key.isDown(MOM.key.codes.RIGHT) ) {
            if ( my.map.canMoveRight(topLeftX + my.size, topLeftY, my.size) ) {
                my.x = my.x + 1;
                moving = true;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.UP) ) {
            if ( my.map.canMoveUp(topLeftX, topLeftY, my.size)) {
                my.y = my.y - 1;
                moving = true;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.DOWN) ) {
            if ( my.map.canMoveDown(topLeftX, topLeftY + my.size, my.size) ) {
                my.y = my.y + 1;
                moving = true;
            }
        }
    };

    that.update = function() {
        move();
        if ( frame <= 9 ) {
            frame++;
        }
        else {
            frame = 1;
        }
    };

    that.getMapOffset = function() {
        return my.map.getTopLeft(my.x, my.y);
    };

    that.draw = function() {
        my.map.draw(my.x, my.y);

        if ( moving ) {
            var offset = frame <= 5 ? 1 : 2;

            my.context.drawImage(
                MOM.resource[ 'sam.png' ],
                my.size * offset, 0, my.size, my.size,
                ( my.canvas.width - my.size ) / 2, ( my.canvas.height - my.size ) / 2, my.size, my.size
            );
        }
        else {
            my.context.drawImage(
                MOM.resource[ 'sam.png' ],
                0, 0, my.size, my.size,
                ( my.canvas.width - my.size ) / 2, ( my.canvas.height - my.size ) / 2, my.size, my.size
            );
        }
    };

    return that;
};
