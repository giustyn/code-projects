$(function () {
  const $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    animeDuration = 1000,
    timerDuration = 10000,
    indexes = getRandomIndexes(10),
    category = ["news", "celeb", "sports"][2],
    dataURI = {
      local: "c:\\data\\" + category + "\\",
      server:
        "https://retail.adrenalineamp.com/rss/Xnews/" + category + "/1920/",
      // server: "https://retail.adrenalineamp.com/rss/Hnews/" + category + "/1920/",
      // server: "https://retail.adrenalineamp.com/rss/Hnews/canada/1920/",
    };

  let feeds = [],
    counter = 0;

  // var regularImg = $(".media").css({ width: "56.25%" });
  // var fullScreenImg = $(".media").css({ width: "100%" });

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
      .addClass(mode[1])
      .delay($revealerSpeed * 1.5)
      .queue(function () {
        $(this).removeClass("revealer--animate").removeClass(mode[1]).dequeue();
      });
  }

  function animateTemplate($clone) {
    console.log($clone[0]);

    let article = $clone[0].querySelectorAll("article"),
      media = $clone[0].querySelectorAll("img"),
      content = $clone[0].querySelectorAll(".text *");

    const animateIn = anime
      .timeline({
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: timerDuration,
        autoplay: true,
        loop: false,
      })
      .add({
        targets: media,
        duration: animeDuration,
        delay: anime.stagger(100, { start: animeDuration / 2 }),
        // opacity: [0, 1],
        // translateX: ["100%", "0%"],
      })
      .add({
        targets: content,
        duration: animeDuration,
        delay: anime.stagger(10),
        opacity: [0, 1],
      })
/* d */;
  }

  function cloneTemplate($container, $template, data) {
    const $clone = $template
        .clone()
        .attr("id", counter)
        .css("z-index", counter)
        .removeClass("hidden"),
      clo = $clone[0].querySelectorAll(".text");

    $clone.find(".media img").attr("src", data.image.src);
    $clone.find(".story .text").text(data.story);
    $container.prepend($clone);

    resizeText({ elements: clo });
    isolateTag({ element: clo });
    splitText({ element: clo });

    animateTemplate($clone);

    /*     setTimeout(function () {
      $clone.remove();
    }, timerDuration + animeDuration); */
  }

  function iterateAnimations() {
    const $template = $("article").remove();
    const $container = $("main");

    cloneTemplate($container, $template, feeds[counter]);
    console.log(counter);
    counter++;

    let cycle = setInterval(addSlide, timerDuration);
    function addSlide() {
      cloneTemplate($container, $template, feeds[counter]);
      console.log(counter);
      counter = (counter + 1) % feeds.length;
    }
    // clearInterval(cycle);
  }

  function onTemplateError(result) {
    console.warn("could not get data");
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, function (i) {
      feeds.push(result.Items[i]);
    });
    iterateAnimations();
  }

  function init() {
    getArticles(dataURI.server, indexes).done((response) => {
      console.log(response);
      onTemplateSuccess(response);
    });
    // .fail((response) => {
    //   onTemplateError(response);
    // });
  }

  init();
});
