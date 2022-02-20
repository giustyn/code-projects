$(function () {
  const userName = "Adrenaline Agency",
    userIcon = "./img/ADR_Logo_A_RGB.svg",
    animeDuration = 2000,
    timerDuration = 5000,
    revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    dataURI = {
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

  function animateFeed($content) {
    let article = $($content).find('article');
    console.log(article[0])

    // $.each($content, (i, el) => {
    // console.log(i, el, "neat");
    let animation = anime.timeline();
    animation.add({
      targets: article,
      easing: 'easeInOutExpo',
      opacity: {
        value: [0, 1],
        duration: animeDuration,
        /* delay: (el, i) => {
          $(el).removeClass("hidden");
          return timerDuration * (i + 1);
        }, */
      },
    });

    /*     let start = anime
      .timeline({
        targets: article,
        autoplay: true,
        loop: false,
        duration: animeDuration,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        // begin: () => console.warn(el, i)
      })
      .add({
        translateX: ["50%", "0%"],
        // endDelay: timerDuration,
        opacity: [0, 1],
      }); */
    // start.finished.then(alert('dang'))
    // });
  }

  function createFeed($container, $template, data) {
    $container.attr({
      category: data.Category,
      duration: data.Duration,
    });
    $container.find("header .title").html(data.Title);
    $container.find("footer .source").html(data.Disclaimer.A?.Source);
    $container.find("footer .disclaimer").html(data.Disclaimer.A?.Text);

    $container
      .find("background")
      .add("video")
      .attr({
        type: "video/mp4",
        poster: data.Media.ImageUrl,
        src: data.Media.VideoUrl,
      })
      .prop({
        autoplay: true,
        muted: true,
        loop: true,
      });

    $(data.Content).each((i, el) => {
      let $clone = $template.clone();
      $clone.attr({ id: i });
      $clone.find(".text").html(el.Text);
      $clone.find(".source").html(el.Source);
      $template.parent().append($clone);
    });
    $template.remove();
    animateFeed($container);
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");
    const $data = feeds[9];

    createFeed($container, $template, $data);
    current++;

    const $timer = $container.attr("duration");

    return;
    setInterval(() => {
      createFeed($container, $template, $data);
      current = (current + 1) % feeds.length;
    }, $timer);

    $template.remove();
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, (i) => {
      feeds.push(result.Items[i]);
    });
    iterateAnimations();
  }

  function getJson(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: (result) => {
        onSuccess(result);
      },
      error: (result) => {
        onError(result);
      },
    });
  }

  function init() {
    // getJson(onTemplateSuccess, onTemplateError, dataURI.local);
    getJson(onTemplateSuccess, onTemplateError, dataURI.server);
  }
  init();
});
