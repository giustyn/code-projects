(function () {
  const url = new ExtendedURL(window.location.href);
  let dataURI =
    "https://kitchen.screenfeed.com/feed/0bguMIg3y0CKeD2PSb0RHA.json?&location=";

  function ExtendedURL(href) {
    this.url = new URL(href);
    this.getSearchParam = function (param) {
      return this.url.searchParams.get(param);
    };
    return this;
  }

  function setContent(e) {
    let $container = $(".container").attr("src", e.Items[0].Media[0].Url);
    let $media = $(".media").attr("src", e.Items[0].Media[0].Url);
    console.log($media[0]);
  }

  function getData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        // console.log(result, data);
        onSuccess(result);
        setContent(result);
      },
      error: function (result) {
        // console.error(result);
        onError(result);
      },
    });
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    console.log("loaded");
  }

  function init() {
    window.parent.PlayerSDK = {
      getTagsPlayer: function () {
        return [{ Id: 2, Name: "ZIP-63366" }];
      },
    };

    var intervalId = setInterval(function () {
      if (window.parent.PlayerSDK) {
        clearInterval(intervalId);

        try {
          var tags = window.parent.PlayerSDK.getTagsPlayer();
          var tag = tags.find(
            (tag) => tag.Name && tag.Name.toLowerCase().startsWith("zip-")
          );
          var code = tag && tag.Name && tag.Name.match(/\d{5}/);

          var zipcode = code || url.getSearchParam("zipcode") || "60606";
          var weather_api = dataURI + zipcode;
          console.log(weather_api);

          getData(onTemplateSuccess, onTemplateError, weather_api);
        } catch (error) {
          // document.getElementById("error").innerHTML = error;
          console.log(error);
        }
      } else {
        console.log("fail");
        clearInterval(intervalId);
      }
    }, 100);
  }

  init();
})();
