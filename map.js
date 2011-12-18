MOM.map = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    that.height = 350;
    that.width  = 700;

    that.canMoveLeft = function(topLeftX, topLeftY, size) {
        for ( var y = topLeftY; y <= topLeftY + size; y++ ) {
            var pixelArray = my.context.getImageData( topLeftX - 1, y, 1, 1 ).data;

            if (
                pixelArray[0] == 0
                && pixelArray[1] == 0
                && pixelArray[2] == 0
            ) {
                return false;
            }
        }

        return true;
    };

    that.canMoveRight = function(topRightX, topRightY, size) {
        for ( var y = topRightY; y <= topRightY + size; y++ ) {
            var pixelArray = my.context.getImageData( topRightX + 1, y, 1, 1 ).data;

            if (
                pixelArray[0] == 0
                && pixelArray[1] == 0
                && pixelArray[2] == 0
            ) {
                return false;
            }
        }

        return true;
    };

    that.canMoveDown = function(bottomLeftX, bottomLeftY, size) {
        for ( var x = bottomLeftX; x <= bottomLeftX + size; x++ ) {
            var pixelArray = my.context.getImageData( x, bottomLeftY + 1, 1, 1 ).data;

            if (
                pixelArray[0] == 0
                && pixelArray[1] == 0
                && pixelArray[2] == 0
            ) {
                return false;
            }
        }

        return true;
    };

    that.canMoveUp = function(topLeftX, topLeftY, size) {
        for ( var x = topLeftX; x <= topLeftX + size; x++ ) {
            var pixelArray = my.context.getImageData( x, topLeftY - 1, 1, 1 ).data;

            if (
                pixelArray[0] == 0
                && pixelArray[1] == 0
                && pixelArray[2] == 0
            ) {
                return false;
            }
        }

        return true;
    };


    that.getTopLeft = function(offsetX, offsetY) {
        var topLeftX = (that.width / 2) - offsetX;
        var topLeftY = (that.height / 2) - offsetY;

        return [ topLeftX, topLeftY ];
    };

    that.draw = function(offsetX, offsetY) {
        var topLeft = that.getTopLeft(offsetX, offsetY);

        my.context.fillStyle = 'black';
        my.context.fillRect( 0, 0, my.canvas.width, my.canvas.width);

        var bg = MOM.resource['bg.png']
        my.context.drawImage( bg, 0, 0, bg.width, bg.height, topLeft[0], topLeft[1], bg.width, bg.height);
    };

    return that;
};
