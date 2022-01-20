(function () {

  // Your variables go here...
  var $content = $('.content'),
      $bumper = $('#bumper'),
      screen,
      portal = 'weather';

  function init() {
    // Setup 
    getScreenSize();
    setWindowScale();
  }

  $(".image").attr('src' , 'c:\\data\\'+portal+'\\weather.jpg');

  // $(".image").attr('src' , '_dev/' + random + '.jpg');

  $bumper[0].addEventListener('timeupdate', videoTimeUpdate)
  init();

  function videoTimeUpdate(event) {
    var eventItem = event.target;
    var current = Math.round(eventItem.currentTime * 1000);
    var total = Math.round(eventItem.duration * 1000);
    if ((total - current) < 500) {
      eventItem.removeEventListener('timeupdate', videoTimeUpdate);
      $($bumper).fadeOut(500, function() {
        $($bumper).remove();
      });
    }
  }

  // ----------------
  //
  // HELPER Functions
  //
  // ----------------
  function getScreenSize() {
    screen = {
      height: window.innerHeight,
      width: window.innerWidth,
      orientation: window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical'
    };
  }

  function setWindowScale() {
    var scale;
    if (screen.orientation === 'horizontal') {
      scale = (screen.height / 1080) * 100;
      if (scale > 90 && scale < 110) {
        scale = 100;
      }

      $('html').css('font-size', (16 * (scale) / 100) + 'px');
    } else {
      scale = (screen.width / 1080) * 100;
      if (scale > 90 && scale < 110) {
        scale = 100;
      }
      $('html').css('font-size', (16 * (scale) / 100) + 'px');
    }
    console.info('  scale:' + scale);
  }

})();