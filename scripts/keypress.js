(function($) {
  'use strict';

    // progress bar
    var startColor = '#FC5B3F';
    var endColor = '#6FD57F';

    var line = new ProgressBar.Line('body', {
      from: {
        color: startColor
      },
      to: {
        color: endColor
      },
      step: function(state, bar) {
        bar.path.setAttribute('stroke', state.color);
      },
      svgStyle: {
        display: 'block',
        position: 'fixed',
        top: '0',
        width: '100%',
        // Set default step function for all animate calls
        step: function(state) {
          line.path.setAttribute('stroke', state.color);
        }
      }
    });

    var circle = new ProgressBar.Circle('#circle-wrap', {
      color: 'white',
      strokeWidth: 3,
      trailWidth: 1,
      easing: 'easeInOut',
      duration: 1200,
      text: {
        value: '0',
        style: {
          fontSize: '80px',
          fontWeight: 700,
          position: 'relative',
          top: '-210px',
          textAlign: 'center'
        }
      },
      step: function(state, bar) {
        bar.setText((bar.value() * 328).toFixed(0));
      }
    });

    // demo
    var start = document.getElementById('start');
    var $start = $('#start');
    var park = document.getElementById('video-park');
    var $park = $('#video-park');
    var end = document.getElementById('end');
    var bgSound = document.getElementById('bg-sound');
    var beeper = document.getElementById('beeper');
    var durationPark = 0;

    bgSound.volume = 0.6;

    park.addEventListener('loadedmetadata', function() {
      durationPark = park.duration;
    });

    var $mask = $('.mask');
    var $endMask = $('.end-mask');

    var circleShowed = false;

    // reverse
    var intervalRewind;

    function rewind(rewindSpeed, video) {
      clearInterval(intervalRewind);
      var startSystemTime = new Date().getTime();
      var startVideoTime = video.currentTime;

      video.volume = 0;

      intervalRewind = setInterval(function() {
        video.playbackRate = 1.0;
        if (video.currentTime === 0) {
          clearInterval(intervalRewind);
          video.pause();
        } else {
          var elapsed = new Date().getTime() - startSystemTime;
          video.currentTime = Math.max(startVideoTime - elapsed * rewindSpeed / 1000.0, 0);

          // progress bar
          // console.log(park.currentTime / durationPark);
          line.animate(0, {
            duration: (durationPark - park.currentTime) * 1000
          }); // Number from 0.0 to 1.0
        }
      }, 80);
    }

    // demo
    var space = false;
    var leapmotion = false;
    var spacebarModeCopy = $mask.find('h1').html();

    $(document).keydown(function(e) {
      if (e.keyCode === 76) {
        e.preventDefault();
        beeper.play();
        if (leapmotion) {
          leapmotion = !leapmotion;
          $mask.find('h1').html(spacebarModeCopy);
        } else {
          leapmotion = !leapmotion;
          $mask.find('h1').html('REACH OUT YOUR <span class="spacebar animated pulse demo"> HAND</span> TO START');
          // Leap.loop uses browser's requestAnimationFrame
          var options = {
            enableGestures: true
          };

          // Main Leap Loop
          Leap.loop(options, function(frame) {

            // hands
            var handNum = frame.hands.length;

            if (handNum >= 1) {
              clearInterval(intervalRewind);

              park.volume = 0.5;

              bgSound.volume = 0;
              $start.fadeOut(300);
              $park.fadeIn(300);

              $mask.css({
                'opacity': 0
              });

              if (park.currentTime !== durationPark) {
                park.play();
                // progress
                line.animate(1, {
                  duration: (durationPark - park.currentTime) * 1000
                });
                // console.log(park.currentTime / durationPark);
              } else {
                park.pause();
                beeper.play();

                $endMask.css({
                  'opacity': 1
                });
                if (!circleShowed) {
                  circle.animate(0, function() {
                    circle.animate(1);
                  });
                  circleShowed = true;
                }
              }
            } else {
              bgSound.volume = 0.6;
              $park.fadeOut(1300);
              $start.fadeIn(1300);

              if (park.currentTime !== durationPark) {
                rewind(2.0, park, $park);
                $mask.css({
                  'opacity': 1
                });
              }
            }
          });
        }
      }
    });

    $(function() {
      $(document).keyup(function(e) {
        if (e.keyCode === 32) {
          e.preventDefault();
          space = false;

          bgSound.volume = 0.6;
          $park.fadeOut(1300);
          $start.fadeIn(1300);

          if (park.currentTime !== durationPark) {
            rewind(2.0, park, $park);
            $mask.css({
              'opacity': 1
            });
            // progress
            // console.log(park.currentTime / durationPark);
          } else {

            line.set(0); // Number from 0.0 to 1.0
            start.pause();
            park.pause();
            $park.remove();
            $start.remove();

            end.volume = 0.6;
            end.play();
          }
        }
      });
      $(document).keydown(function(e) {
        if (e.keyCode === 32) {
          e.preventDefault();
          space = true;

          clearInterval(intervalRewind);

          park.volume = 0.5;

          bgSound.volume = 0;
          $start.fadeOut(300);
          $park.fadeIn(300);

          $mask.css({
            'opacity': 0
          });

          if (park.currentTime !== durationPark) {
            park.play();
            // progress
            line.animate(1, {
              duration: (durationPark - park.currentTime) * 1000
            });
            // console.log(park.currentTime / durationPark);
          } else {
            park.pause();
            beeper.play();

            $endMask.css({
              'opacity': 1
            });
            if (!circleShowed) {
              circle.animate(0, function() {
                circle.animate(1);
              });
              circleShowed = true;
            }
          }
        }
      });
    });
})(jQuery, ProgressBar);
