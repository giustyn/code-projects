/**
 *  API Components / Diagnostics
 */

function timer() {
  var startTime = Date.now();
  var counter = setInterval(function () {
    var elapsedTime = Date.now() - startTime;
    var clock = document.getElementById("timer");
    clock.innerHTML = (elapsedTime / 1000).toFixed(2);
    if (elapsedTime >= 40000) return clearInterval(counter);
  }, 10);
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

  // var $clock = $("#fps");
  var clock = document.getElementById("fps");
  (function loop() {
    requestAnimationFrame(function () {
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

function memoryUsage() {
  var script = document.createElement("script");
  script.src =
    "https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js";
  document.head.appendChild(script);
}

function getlocalStorageSize(el) {
  // return new Blob(Object.values(localStorage)).size;

  //this script is to find the size of localStorage
  function func1(num) {
    return new Array(num * 1024 + 1).join("a");
  }

  // Determine the size of localStorage if it's not set
  if (!localStorage.getItem(el)) {
    var i = 0;
    try {
      // Test up to 10 MB
      for (i = 0; i <= 10000; i += 250) {
        localStorage.setItem("test", func1(i));
      }
    } catch (e) {
      localStorage.removeItem("test");
      localStorage.setItem(el, i ? i - 250 : 0);
    }
  }
}

function diag(enabled) {
  let diagnostic = document.getElementById("diag");
  if (enabled) {
    diagnostic.style.display = "flex";

    timer(fps());
    memoryUsage();

    document.getElementById("agent").innerHTML = navigator.userAgent;
    document.getElementById("ram").innerHTML = perfRAM();

    // Get Navigation Timing entries:
    // console.log(performance.getEntriesByType("navigation"));

    // Get Resource Timing entries:
    // console.log(performance.getEntriesByType("resource"));
  } else return diagnostic.remove();
}
