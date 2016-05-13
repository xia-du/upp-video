(function($) {
  'use strict';
  var video = document.getElementById('ad');
  var $ad = $('#ad');
  // reverse
  var intervalRewind;

  function rewind(rewindSpeed) {
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
      }
    }, 80);
  }

  $ad.on('mouseenter', function(e) {
    e.preventDefault();
    /* Act on the event */
    video.volume = 1;
    video.play();
  }).on('mouseout', function(e) {
    e.preventDefault();
    /* Act on the event */
    video.pause();
    rewind(3.0, video, $ad);
  });
})(jQuery);
