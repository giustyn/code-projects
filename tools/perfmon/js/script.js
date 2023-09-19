function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function timer() {
  var startTime = Date.now();
  var interval = setInterval(function () {
    var elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(
      2
    );
  }, 10);
}

function digitalClock() {
  var timeHTML = document.getElementById("timer");

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var date = d.getDate();
  // date = addZero(date);
  var hours = d.getHours();
  hours = addZero(hours);
  var minutes = d.getMinutes();
  minutes = addZero(minutes);
  var seconds = d.getSeconds();
  seconds = addZero(seconds);

  timeHTML.innerHTML = hours + ":" + minutes + ":" + seconds;

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
}

function fps() {
  window.countFPS = (function () {
    var lastLoop = new Date().getMilliseconds();
    var count = 1;
    var fps = 0;

    return function () {
      var currentLoop = new Date().getMilliseconds();
      if (lastLoop > currentLoop) {
        fps = count;
        count = 1;
      } else {
        count += 1;
      }
      lastLoop = currentLoop;
      return fps;
    };
  })();
  var clock = document.getElementById("fps");
  (function loop() {
    requestAnimationFrame(function () {
      digitalClock();
      clock.innerHTML = countFPS();
      loop();
    });
  })();
}
function perfRAM() {
  performance.memory.jsHeapSizeLimit; // will give you the JS heap size
  performance.memory.usedJSHeapSize; // how much you're currently using

  arr = [];
  for (var i = 0; i < 100000; i++) arr.push(i);
  performance.memory.usedJSHeapSize; // likely a larger number now

  return [
    "jsHeapSizeLimit: " + performance.memory.jsHeapSizeLimit,
    " usedJSHeapSize: " + performance.memory.usedJSHeapSize,
  ];
}
function getRAM() {
  return new Blob(Object.values(localStorage)).size;
}
function toggleMute(el) {
  console.log(el);
  var video = document.getElementById(el);
  video.muted = !video.muted;
}
function diag() {
  fps();
  getRAM();
  let agent = navigator.userAgent;
  document.getElementById("agent").innerHTML = "User-agent:<br>" + agent;
  const memory = navigator.deviceMemory;
  // let ram = `This device has at least ${memory}GB of RAM`;
  document.getElementById("ram").innerHTML = getRAM();;
  // document.getElementById("ram").innerHTML = perfRAM();

  // console.log(toggleMute("video"))
  // alert(JSON.stringify(localStorage))
  // localStorage.clear();
}
// delay(1500).then(() => diag());
diag();
