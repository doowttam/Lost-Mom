MOM = function() {

    var canvas  = null;
    var context = null;

    var frameInterval = null;

    var sam = null;
    var mom = null;

    var frame     = 0;
    var framerate = 40;

    var score      = 0;
    var finalscore = 0;

    var messagesCount = 7;
    var message = {
        "text": '',
        "time": 0,
        "speaker": 0,
    };

    var buttons = {};

    var loadResources = function( playCallback ) {
        var imageCount = 0;
        var audioCount = 0;

        var images = [ 'map.png', 'toys/toy1.png', 'toys/toy2.png', 'toys/toy3.png', 'toys/toy4.png', 'sam.png', 'mom.png' ];
        var audios = [ 'distraction.wav', 'bg.ogg', 'gameover.ogg' ];

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

    var setMessage = function(msgNum, time, speaker) {
        var msg;
        switch(msgNum)
        {
        case 1:
            msg = 'Come on, hun, keep up.';
            break;
        case 2:
            msg = 'Whoa, cool!';
            break;
        case 3:
            msg = 'What does this do?';
            break;
        case 4:
            msg = 'Can we get one of these?';
            break;
        case 5:
            msg = 'Mom, did you see this?';
            break;
        case 6:
            msg = 'Neat!';
            break;
        case 7:
            msg = 'I definitely need this.';
            break;
        }

        if ( msg ) {
            message.text = msg;
            message.time = time * framerate;
            message.speaker = speaker;
        }
    };

    var drawMessage = function() {
        if ( message.time > 0 ) {
            var bgColor = 'rgba(205,117,0,.65)';
            if ( message.speaker == 0 ) {
                bgColor = 'rgba(0,122,189,.65)';
            }

            context.fillStyle = bgColor;
            context.fillRect( 0, canvas.height - 60, canvas.width, 75);

            context.fillStyle = 'black';
            context.font = "bold 20px sans-serif";
            context.textAlign = "left";
            context.textBaseline = "top";
            context.fillText('"' + message.text + '"', 20, canvas.height - 50);

            message.time--;
        }
    };

    var drawScore = function() {
        context.fillStyle = 'rgba(0,0,0,.5)';
        context.fillRect( 605, 20, 100, 20);

        context.fillStyle = 'white';
        context.font = "bold 12px sans-serif";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText('Score: ' + Math.floor(score), 610, 22);
    };

    var showTitleScreen = function() {
        var bg = MOM.resource['map.png']
        context.drawImage( bg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

        context.fillStyle = 'rgba(0,0,0,.7)';
        context.fillRect( 0, 0, canvas.width, canvas.height);

        context.font = "bold 48px sans-serif";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText('"Mom?"', canvas.width - canvas.width / 2, 100);
        context.font = "bold 24px sans-serif";
        context.fillText("Don't get left alone in the store!", canvas.width - canvas.width / 2, 150);

        context.font = "bold 22px sans-serif";
        context.fillText("Arrow keys move, press the start button to begin!", canvas.width - canvas.width / 2, 275);

        var samImage = MOM.resource[ 'sam.png' ];

        context.drawImage(
            samImage,
            0, 0, 16, 16,
            (canvas.width - 16) / 2, 220, 16, 16
        );
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
                "pathMap": [
                    [ 750, 500 ],
                    [ 50, 500 ],
                    [ 50, 100 ],
                    [ 750, 350 ],
                    [ 1500, 350 ],
                    [ 1500, 100 ],
                    [ 840, 100 ],
                    [ 840, 500 ] ]
            });

            win.onkeyup = function(e) {
                MOM.key.onKeyUp(e);
            };
            win.onkeydown = function(e) {
                MOM.key.onKeyDown(e);
            };

            buttons.start = doc.getElementById("start");
            buttons.pause = doc.getElementById("pause");
            buttons.reset = doc.getElementById("reset");

            buttons.start.onclick = MOM.start;
            buttons.start.disabled = true;

            buttons.pause.onclick = MOM.pause;
            buttons.pause.disabled = true;

            buttons.reset.onclick = function() { location.reload() };
            buttons.reset.disabled = true;

            loadResources(function() {
                buttons.start.disabled = false;
                showTitleScreen();
            });
        },

        start: function() {
            buttons.start.disabled = true;
            buttons.pause.disabled = false;
            buttons.reset.disabled = false;

            setMessage(1, 5, 0);
            frameInterval = MOM.play();
        },

        play: function() {
            if ( mom ) {
                this.resource['bg.ogg'].addEventListener('ended', function() {
                    MOM.resource['bg.ogg'].play();
                });
                MOM.resource['bg.ogg'].play();
            }
            else {
                MOM.resource['gameover.ogg'].play();
            }

            return setInterval( function() {
                MOM.drawFrame();
            }, 1000 / framerate );
        },

        pause: function() {
            if ( frameInterval ) {
                MOM.resource['bg.ogg'].pause();
                MOM.resource['gameover.ogg'].pause();

                clearInterval( frameInterval );
                frameInterval = null;

                context.fillStyle = 'rgba(0,0,0,.5)';
                context.fillRect( 0, 0, canvas.width, canvas.height);

                context.font = "bold 48px sans-serif";
                context.fillStyle = "white";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText("PAUSED", canvas.width - canvas.width / 2, canvas.height - canvas.height / 2);
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

            score = frame / framerate;

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
                    MOM.resource['bg.ogg'].pause();
                    MOM.resource['gameover.ogg'].play();

                    mom = null; // kinda morbid, did she die???

                    finalscore = score;
                }

                if ( frame % 250 == 0 ) {
                    var distraction = MOM.distraction({
                        "context": context,
                        "canvas":  canvas
                    });
                    MOM.distractions.push(distraction);

                    // Get a number from 2 -> messagesCount
                    var i = Math.floor(Math.random() * (messagesCount - 2)) + 2;
                    setMessage(i, 3, 1);

                    MOM.resource['distraction.wav'].play();
                }

                for ( var i = 0; i < MOM.distractions.length; i++ ) {
                    MOM.distractions[i].draw();
                }

                drawMessage();
                drawScore();
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
                context.fillText("You kept up for " + finalscore + " seconds! Try again!", canvas.width - canvas.width / 2, 275);
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
