(function(webkitSpeechRecognition) {
  'use strict';

  var v = [];

  var started = false;

  v[0] = [
    'videos/stand.mp4'
  ];
  v[1] = [
    'videos/1.mp4'
  ];
  v[2] = [
    'videos/2.mp4'
  ];
  v[3] = [
    'videos/3.mp4'
  ];

  var timer;

  function changeVid(n) {
    var video = document.getElementById('video');
    video.setAttribute('src', v[n]);
    console.log(v[n]);
    video.load();
  }

  function resetTimer() {
    timer = window.setTimeout(function() {
      console.log('reset');
      changeVid(0);
    }, 5000);
  }

  function clear() {
    window.clearTimeout(timer);
  }

  function random() {
    var rand = Math.random();
    rand = Math.round(random * 3) + 1;
    if (rand > 4) {
      return 3;
    } else {
      return rand;
    }
  }

  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function() {
      clear();
      resetTimer();
    };
    var finalTranscript = '';
    recognition.onresult = function(event) {
      finalTranscript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      document.getElementById('result').value = finalTranscript;

      console.log(finalTranscript);

      // DO SOMETHING HERE

      if (finalTranscript.search('show me a trick') !== -1) {
        clear();
        if (started) {
          changeVid(random());
        } else {
          changeVid(1);
        }
        resetTimer();
        started = true;
      }

      if (finalTranscript.search('another') !== -1 && started === true) {
        clear();
        changeVid(random());
        resetTimer();
      }
    };
    recognition.start();
  }
})();
