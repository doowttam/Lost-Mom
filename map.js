MOM.map = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    that.height = 350;
    that.width  = 700;

    that.draw = function(offsetX, offsetY) {
        var topLeftX = (that.width / 2) - offsetX;
        var topLeftY = (that.height / 2) - offsetY;

        my.context.fillStyle = 'red';
        my.context.fillRect( 0, 0, my.canvas.width, my.canvas.width);

        var bg = MOM.resource['bg.png']
        my.context.drawImage( bg, 0, 0, that.width, that.height, topLeftX, topLeftY, that.width, that.height );
    };

    return that;
};
