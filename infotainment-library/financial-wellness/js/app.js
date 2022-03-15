$(function () {
  const userName = "Adrenaline Agency",
    userIcon = "./img/ADR_Logo_A_RGB.svg",
    animeDuration = parseInt($(":root").css("--anime-speed")) || 500,
    timerDuration = 5000,
    dataURI = {
      local: "c:\\data\\wellness\\content.json",
      server: "./content.json",
    };

  let feeds = [],
    current = 0;

  function setStage($container, $template, data) {
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
        autoplay: false,
        muted: true,
        loop: true,
      });
  }

  function setContent($template, data) {
    const delayLoop = (fn, delay) => {
      return (x, i) => {
        setTimeout(() => {
          fn(x);
        }, i * delay);
      };
    };

    let interval = timerDuration + animeDuration,
      articles = [];
      
    $(data.Content).each((i, el) => {
      let $clone = $template.clone();
      $clone.attr({ id: i });
      $clone.find(".text").html(el.Text);
      $clone.find(".source").html(el.Source);
      $template.parent().append($clone);
      articles.push($clone);
    });
    articles.forEach(delayLoop(animateContent, interval));
    $template.remove();
  }

  function iterateAnimations() {
    const $template = $("article");
    const $container = $("main");
    const $data = feeds[9];

    setStage($container, $template, $data);
    setContent($template, $data);

    current++;

    return;
    setInterval(() => {
      setStage($container, $template, $data);
      current = (current + 1) % feeds.length;
    }, $timer);

    $template.remove();
  }

  function animateContent($content) {
    let article = $content[0],
      animation = anime
        .timeline({
          targets: article,
          autoplay: true,
          loop: false,
          duration: animeDuration,
          easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        })
        .add(
          {
            targets: article.querySelectorAll(".text"),
            translateX: ["10%", "0"],
            endDelay: timerDuration - animeDuration,
            begin: () => $($content).addClass("active"),
          },
          "+=3000"
        )
        .add(
          {
            targets: article.querySelectorAll(".text"),
            translateY: ["0%", "10"],
            opacity: [1, 0],
            complete: () => $($content).removeClass("active"),
          },
          "+=500"
        );
    console.log(article);
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
