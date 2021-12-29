(function () {
  const $bumper = $("#bumper"),
    // dataURI = "c:\\data\\",
    dataURI = "../_Feeds/data/",
    folderName = ["news"][0],
    timerDuration = 10000;

  let loadedStories = [],
    currentStory = 0;

  Array.prototype.shuffle = function () {
    const input = this;

    for (let i = input.length - 1; i >= 0; i--) {

      const randomIndex = Math.floor(Math.random() * (i + 1));
      const itemAtIndex = input[randomIndex];

      input[randomIndex] = input[i];
      input[i] = itemAtIndex;
    }
    return input;
  }

  function init() {
    getScreenSize();
    const imageArray = [];
    for (let i = 0; i < 10; i++) {
      imageArray.push(i + ".jpg");
    }
    imageArray.shuffle();
    addStories(imageArray)
    // add stories to view
  }

  function addStories(imageNames) {
    let ten = 10; //there are only 10 stories
    while (ten) { //once 0 it will be false
      const newImage = new Image();
      newImage.addEventListener("load", function (e) {
        const storyDiv = document.createElement("div");
        storyDiv.id = folderName + '_' + e.path[0].src.slice(e.path[0].src.lastIndexOf('/') + 1, -4);
        storyDiv.classList.add('story');
        storyDiv.appendChild(newImage);
        document.body.appendChild(storyDiv);
        loadedStories.push(storyDiv);
        loadXML(e.path[0].src.slice(0, -3) + "xml");
      }, false);
      newImage.src = dataURI + folderName + "\\" + imageNames[ten - 1]; //offset to 0-1
      ten--;
    }
  }

  function loadXML(xmlPath) {
    const request = new XMLHttpRequest();
    request.open("GET", xmlPath, true);

    request.send(null);

    // state changes
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        // done
        if (request.status === 200 || request.status === 0) {
          // complete
          const storyID = folderName + "_" + request.responseURL.slice(request.responseURL.lastIndexOf('/') + 1, -4);
          const xmlstory = loadedStories.find(ele => ele.id == storyID);
          let textDiv = document.createElement('div');
          textDiv.classList.add('text');
          textDiv.innerHTML = $(request.responseText).find("story")[0].innerHTML;
          xmlstory.appendChild(textDiv);
        }
      }
    };
  }

  function videoTimeUpdate(event) {
    const eventItem = event.target;
    const current = Math.round(eventItem.currentTime * 1000);
    const total = Math.round(eventItem.duration * 1000);
    if ((total - current) < 500) {
      eventItem.removeEventListener("timeupdate", videoTimeUpdate);
      loadedStories[0].classList.add('visible');
      setInterval(showNextStory, timerDuration);
      $($bumper).fadeOut(500, function () {
        $($bumper).remove();
      });
    }
  }

  function showNextStory() {
    loadedStories[currentStory].classList.remove('visible');
    currentStory++;
    currentStory = currentStory >= loadedStories.length ? 0 : currentStory;
    loadedStories[currentStory].classList.add('visible');
  }

  // ----------------
  //
  // HELPER Functions
  //
  // ----------------
  function getScreenSize() {
    window = {};
    window = {
      height: window.innerHeight,
      width: window.innerWidth,
      orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical"
    };
    setWindowScale();
  }

  function setWindowScale() {
    let scale;
    if (window.orientation === "horizontal") { // window.nanoBrowserSize.orientation
      scale = (window.height / 1080) * 100; // window.nanoBrowserSize.height
      if (scale > 90 && scale < 110) {
        scale = 100;
      }

      $("html").css("font-size", (16 * (scale) / 100) + "px");
    } else {
      scale = (window.width / 1080) * 100; // window.nanoBrowserSize.width
      if (scale > 90 && scale < 110) {
        scale = 100;
      }
      $("html").css("font-size", (16 * (scale) / 100) + "px");
    }
    console.info("  scale:" + scale);
  }

  $bumper[0].addEventListener("timeupdate", videoTimeUpdate)

  init();
  console.log($bumper[0]);
  console.log(folderName);


})();