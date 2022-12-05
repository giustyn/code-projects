function ready(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function firefly() {
  var i = 0;
  var stop = 15;
  for (i = 0; i < stop; i++) {
    var v = document.createElement("div");
    v.classList = "firefly";
    document.querySelector(".ff").appendChild(v);
  }
}

function loginButton() {
  let btn = document.querySelectorAll('.btn.ng-binding');
  btn[0].innerHTML = "Connect";
}

// function drawBackground() {
//   var img = document.createElement("img");
//   img.src = "../img/adr-bg-bokeh.png";
//   document.getElementById("container").appendChild(img);
// }

ready(function () {
  // DOM is loaded and ready for manipulation here
  firefly();
  loginButton();
});
