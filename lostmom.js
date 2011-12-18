MOM = function() {

    var canvas  = null;
    var context = null;

    var frameInterval = null;

    var sam = null;
    var mom = null;

    var frame     = 0;
    var framerate = 25;

    var score = 0;

    var loadResources = function( playCallback ) {
        var imageCount = 0;
        var audioCount = 0;

        var images = [ 'bg.png', 'toys/toy1.png' ];
        var audios = [];

        var finished = false;

        MOM.loading( imageCount + audioCount, images.length + audios.length );        

        // Just in case things take too long
        setTimeout( function() {
            if ( !finished ) {
                playCallback();
            }

            finished = true;
        }, 4000 );

        var resourceOnLoad = function(type) {
            if ( type == 'image' ) {
                imageCount++;
            }
            if ( type == 'audio' ) {
                audioCount++;
            }

            MOM.loading( imageCount + audioCount, images.length + audios.length );

            if ( imageCount == images.length && audioCount == audios.length ) {
                if ( !finished ) {
                    playCallback();
                }

                finished = true;
            }
        };

        for ( var i = 0; i < images.length; i++ ) {
            var img = new Image();
            img.src = images[i];
            img.addEventListener('load', function() { resourceOnLoad('image'); } );
            MOM.resource[images[i]] = img;
        }

        for ( var i = 0; i < audios.length; i++ ) {
            var sound = new Audio();
            sound.src = audios[i];
            sound.addEventListener('canplaythrough', function() { resourceOnLoad('audio'); } );
            MOM.resource[audios[i]] = sound;
        }
    };

    var drawMessage = function(msgNum) {
        var msg;
        switch(msgNum)
        {
        case 1:
            msg = '"Come on, hun, keep up."';
            break;
        case 2:
            msg = '"Whoa, cool!"';
            break;
        }

        if ( msg ) {
            context.fillStyle = 'rgba(255,255,255,.65)';
            context.fillRect( 0, canvas.height - 60, canvas.width, 75);

            context.fillStyle = 'black';
            context.font = "bold 20px sans-serif";
            context.textAlign = "left";
            context.textBaseline = "top";
            context.fillText(msg, 20, canvas.height - 50);
        }
    };

    return {
        init: function(doc, win) {
            canvas  = doc.getElementById("game_canvas");
            context = canvas.getContext("2d");

            map = MOM.map({
                "context": context,
                "canvas":  canvas
            });

            sam = MOM.sam({
                "context": context,
                "canvas":  canvas,
                "startX":  750,
                "startY":  900,
                "size":    16,
                "map":     map
            });

            mom = MOM.mom({
                "context": context,
                "canvas":  canvas,
                "startX":  750,
                "startY":  850,
                "size":    20,
                "pathMap": [ [ 750, 500 ], [ 50, 500 ], [ 50, 100 ], [ 750, 350 ], [ 1500, 350 ] ]
            });

            win.onkeyup = function(e) {
                MOM.key.onKeyUp(e);
            };
            win.onkeydown = function(e) {
                MOM.key.onKeyDown(e);
            };

            doc.getElementById("pause").onclick = MOM.pause;

            loadResources(function() {
                frameInterval = MOM.play();
            });
        },

        play: function() {
            return setInterval( function() {
                MOM.drawFrame();
            }, framerate );
        },

        pause: function() {
            if ( frameInterval ) {
                clearInterval( frameInterval );
                frameInterval = null;

                context.fillStyle = 'black';
                context.font = "bold 12px sans-serif";
                context.textAlign = "right";
                context.textBaseline = "top";
                context.fillText("PAUSED", canvas.width - 20, 20);
            }
            else {
                frameInterval = MOM.play();
            }
        },

        resetCanvas: function() {
            canvas.width = canvas.width;
        },

        drawFrame: function() {
            frame++;

            // Mega-hack
            // The distractions mess up the collision detection
            // So, we render a clean map, check for collision, update
            // then wipe it and draw everything again
            this.resetCanvas();
            sam.draw(); // also draws map

            sam.update();

            if ( mom ) {
                mom.update();
            }

            this.resetCanvas();

            sam.draw(); // also draws map

            if ( mom ) {
                var offset    = sam.getMapOffset();
                var offScreen = mom.draw(offset);
                if ( offScreen ) {
                    mom = null; // kinda morbid, did she die???

                    score = frame / framerate;
                }

                if ( frame < 300 ) {
                    drawMessage(1);
                }

                if ( frame % 200 == 0 ) {
                    var distraction = MOM.distraction({
                        "context": context,
                        "canvas":  canvas
                    });
                    MOM.distractions.push(distraction);
                }

                for ( var i = 0; i < MOM.distractions.length; i++ ) {
                    MOM.distractions[i].draw();
                }
            }
            // Game over
            else {
                context.fillStyle = 'rgba(0,0,0,.5)';
                context.fillRect( 0, 0, canvas.width, canvas.height);

                context.font = "bold 48px sans-serif";
                context.fillStyle = "white";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText("Oh no! You lost your mom!", canvas.width - canvas.width / 2, 100);
                context.font = "bold 24px sans-serif";
                context.fillText("You're now alone in the store. :(", canvas.width - canvas.width / 2, 150);

                context.font = "bold 22px sans-serif";
                context.fillText("You kept up for " + score + " seconds!", canvas.width - canvas.width / 2, 275);
            }
        },

        resource: {},
        distractions: [],

        distraction: function() {
            return MOM.distraction({
                "context": context,
                "canvas":  canvas
            });
        },

        loading: function(cur, total) {
            this.resetCanvas();

            var msg = "Loading (" + cur + "/" + total + ")...";

            context.font = "bold 12px sans-serif";

            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(msg, canvas.width - canvas.width / 2, canvas.height - canvas.height / 2);
        }
    };
}();
