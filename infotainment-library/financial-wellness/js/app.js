$(function () {
  const userName = "Adrenaline Agency",
    userIcon = "./img/ADR_Logo_A_RGB.svg",
    animeDuration = 750,
    timerDuration = 10000,
    revealerSpeed = parseInt($(":root").css("--revealer-speed"));

  const dataURI = {
    local: "c:\\data\\wellness\\content.json",
    server: "./content.json",
  };

  let feeds = [],
    current = 0;

  function revealer() {
    const $transition = $(".revealer"),
      mode = [
        "revealer--left",
        "revealer--right",
        "revealer--top",
        "revealer--bottom",
      ],
      shuffle = mode[(Math.random() * mode.length) | 0];
    $transition
      .addClass("revealer--animate")
      .addClass(shuffle)
      .delay(revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(shuffle).dequeue();
      });
  }

  function animateContent(feed) {
    let elements = document.querySelectorAll("feed"); // create a nodelist of elements
    // let elements = document.querySelectorAll("article"); // create a nodelist of elements
    console.log(elements);

    var animation = $(feed).each(function (i, el) {
      // console.log(feed);
      let start = anime
        .timeline({
          loop: true,
          autoplay: true,
          duration: 1000,
          opacity: 0,
          easing: "easeInOutQuad",
          begin: () => {
            console.warn("meep meep", i);
          },
        })
        .add({
          targets: elements,
          delay: anime.stagger(2000),
          endDelay: 5000,
          opacity: [0, 1],
        });
    });
  }

  function buildFeedContent() {
    const feed = feeds[9];

    var $article = $("article");
    var $title = $(".title").html(feed.Title);
    var $source = $("footer .source").html(feed.Disclaimer.A?.Source);
    var $disclaimer = $("footer .disclaimer").html(feed.Disclaimer.A?.Text);

    var $container = $(".container").attr({
      duration: feed.Duration,
      category: feed.Category,
    });

    var $video = $("<video />", {
      id: "video",
      class: "background",
      poster: feed.Media.ImageUrl,
    }).prop({
      muted: true,
      autoplay: false,
      loop: true,
    });
    var $videoSrc = $("<source />", {
      type: "video/mp4",
      src: feed.Media.VideoUrl,
    }).appendTo($video);
    $video.prependTo($(".container"));

    var $content = $(feed.Content).each(function (i, el) {
      let $clone = $article.clone();
      $clone.attr({ id: i });
      $clone.find(".text").html(el.Text);
      $clone.find(".source").html(el.Source);
      $article.parent().append($clone);
      animateContent($clone[0]);
    });

    $article.remove();
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, function (i) {
      feeds.push(result.Items[i]);
    });
    buildFeedContent();
  }

  function getJsonData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        // console.log(result)
        onSuccess(result);
      },
      error: function (result) {
        // console.error(result);
        onError(result);
      },
    });
  }

  function init() {
    // getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
    getJsonData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
  }
  init();
});
