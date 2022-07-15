(function() {
  // Your variables go here...
  var $content = $(".content"),
    $bumper = $("#bumper"),
    $content = $(".content"),
    screen,
    portal = "hhttps://retail.adrenalineamp.com/rss/Hnews/celeb/1920", //David set this to the name of the folder that the files are in
    storyList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    currentStory = 0,
    storyDuration = 10000,
    fadeDuration = 500;

  init();

  function init() {
    // Setup
    Shuffle(storyList);
    getScreenSize();
    setWindowScale();
    loadNewStory();
  }

  function Shuffle(o) {
    for (
      var j, x, i = o.length;
      i;
      j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
    );
    return o;
  }

  function fadeOutNews() {
    $($content).fadeOut(fadeDuration, function() {
      loadNewStory();
    });
  }

  function loadNewStory() {
    random = storyList[currentStory];

    $(".image").attr("src", "https://retail.adrenalineamp.com/rss/Hnews/celeb/1920/" + random + ".jpg");

    currentStory++;
    if (currentStory == 10) currentStory = 0;
  }

  function fadeInNews() {
    $($content).fadeIn(fadeDuration);
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
      orientation:
        window.innerWidth > window.innerHeight ? "horizontal" : "vertical"
    };
  }

  function setWindowScale() {
    var scale;
    if (screen.orientation === "horizontal") {
      scale = screen.height / 1080 * 100;
      if (scale > 90 && scale < 110) {
        scale = 100;
      }

      $("html").css("font-size", 16 * scale / 100 + "px");
    } else {
      scale = screen.width / 1080 * 100;
      if (scale > 90 && scale < 110) {
        scale = 100;
      }
      $("html").css("font-size", 16 * scale / 100 + "px");
    }
  }
})();
