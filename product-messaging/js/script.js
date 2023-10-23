(function () {
  const root = document.documentElement;
  const mainStage = document.querySelector(".stage");
  const animeSpeed = 8000;
  const animeDuration = 300;

  const urlParams = new URLSearchParams(window.location.search);
  let devCode = urlParams.get("zipcode");
  let zipCode = null,
    dataURI =
      "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=";

  root.style.setProperty("--animation-speed", animeSpeed + "ms");
  root.style.setProperty("--animation-duration", animeDuration + "ms");

  function sliderEnd() {
    let slider = document.querySelector(".slide.current");
    slider.classList.remove("current");
  }

  function slider() {
    const $$ = (sel, target) => [...(target || document).querySelectorAll(sel)];
    const slides = $$(".slide");
    const len = slides.length;
    let curr = 0;
    let next = 0;
    let loop = false;

    slides[curr].classList.add("current");
    const slideCarousel = setInterval(() => {
      if (loop) next = (curr + 1) % len;
      if (!loop) next = curr + 1;
      if (next >= len) {
        clearInterval(slideCarousel);
        return sliderEnd();
      }
      slides[next].classList.add("current");
      slides[curr].classList.remove("current");
      curr = next;
    }, animeSpeed);
  }

  function setLocation(url) {
    async function getData(url) {
      const response = await fetch(url);
      const result = await response.json();

      let city = result.Locations[0].City;
      let location = document.querySelectorAll(".location");

      location.forEach((e) => (e.innerHTML = city));
    }
    getData(url);
  }

  function init() {
    window.parent.PlayerSDK = {
      getTagsPlayer: function () {
        return [
          // { Id: 0, Name: "ZIP-98225" },
          { Id: 1, Name: "ZIP-10001" },
          // { Id: 2, Name: "ZIP-84106" },
        ];
      },
    };
    var intervalId = setInterval(function () {
      if (window.parent.PlayerSDK) {
        clearInterval(intervalId);

        var tags = window.parent.PlayerSDK.getTagsPlayer();
        var tag = tags.find(
          (tag) => tag.Name && tag.Name.toLowerCase().startsWith("zip-")
        );
        var code = tag && tag.Name && tag.Name.match(/\d{5}/);
        zipCode = devCode || code;
        dataURI = dataURI + zipCode;
        setLocation(dataURI);
        slider();
        console.log(dataURI);
      } else {
        clearInterval(intervalId);
        // slider();
      }
    }, 10);
  }
  init();
  // if (window.addEventListener) {
  //   window.addEventListener("load", init, false);
  // }
})();
