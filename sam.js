MOM.sam = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    my.x     = spec.startX;
    my.y     = spec.startY;
    my.size  = spec.size;
    my.map   = spec.map;

    var move = function() {
        var topLeftX = ( my.canvas.width - my.size ) / 2;
        var topLeftY = ( my.canvas.height - my.size ) / 2;

        if ( MOM.key.isDown(MOM.key.codes.LEFT) ) {
            if ( my.map.canMoveLeft(topLeftX, topLeftY, my.size) ) {
                my.x = my.x - 1;
            }
       } 
        if ( MOM.key.isDown(MOM.key.codes.RIGHT) ) {
            if ( my.map.canMoveRight(topLeftX + my.size, topLeftY, my.size) ) {
                my.x = my.x + 1;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.UP) ) {
            if ( my.map.canMoveUp(topLeftX, topLeftY, my.size)) {
                my.y = my.y - 1;
            }
        }
        if ( MOM.key.isDown(MOM.key.codes.DOWN) ) {
            if ( my.map.canMoveDown(topLeftX, topLeftY + my.size, my.size) ) {
                my.y = my.y + 1;
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
