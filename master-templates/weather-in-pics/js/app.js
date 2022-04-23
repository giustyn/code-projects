(function () {
  const url = new ExtendedURL(window.location.href),
    zipcode = url.getSearchParam("zipcode") || "60606",
    portal =
      "https://kitchen.screenfeed.com/feed/0bguMIg3y0CKeD2PSb0RHA.json?location=" +
      zipcode;

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param);
    };
    return this;
  }

  function ready() {
    let $media = $(".media");

    fetch(portal)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var mediaURL = data.Items[0].Media[0].Url;
        $media.attr("src", mediaURL);
        console.log(portal);
      })
      .catch((err) => {
        // do something
      });
  }

  function init() {
    ready();
  }

  init();
})();
