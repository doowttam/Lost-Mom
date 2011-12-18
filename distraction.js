MOM.distraction = function(spec, my) {
    my = my || {};
    var that = {};

    my.context = spec.context;
    my.canvas  = spec.canvas;

    var images    = [ 'toys/toy1.png' ];
    var my_image  = 0;

    var coords = [0, 0];

    (function() {
        var i = Math.floor(Math.random() * images.length);
        my_image = MOM.resource[ images[i] ];

        var x = Math.floor(Math.random() * my.canvas.width);
        var y = Math.floor(Math.random() * my.canvas.height);
        
        coords[0] = x;
        coords[1] = y;
    })();

    that.draw = function() {
        my.context.drawImage( my_image, 0, 0, my_image.width, my_image.height, coords[0], coords[1], my_image.width, my_image.height );
    };

    return that;
};
