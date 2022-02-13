$(function () {
  const $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    animeDuration = 1500,
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

  var regularImg = $(".media").css({ width: "56.25%" });
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

  function animateComponents($clone, index) {
    let article = document.getElementById(index),
      content = article.querySelector(".text");
    var animateIn = anime
      .timeline({
        duration: animeDuration,
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        autoplay: true,
        loop: false,
      })
      .add({
        targets: article.querySelectorAll(".text *"),
        delay: anime.stagger(30),
        opacity: [0, 1],
      });
  }

  function cloneTemplate($container, $template, data) {
    const $clone = $template
    .clone()
    .attr("id", counter)
    .css("z-index", counter)
    .removeClass("hidden");
    
    $clone.find(".media img").attr("src", data.image.src);
    $clone.find(".text").text(data.story);
    $container.append($clone);
    
    let article = document.getElementById(counter),
    articleText = article.querySelectorAll(".text");
    
    resizeText({ elements: articleText });
    isolateTag({ element: articleText });
    splitText({ element: articleText });
    revealer()
    // animateComponents($clone, counter);

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + animeDuration);
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
    console.log(feeds);
    iterateAnimations();
  }

  function init() {
    getArticles(dataURI.server, indexes).done((response) => {
      onTemplateSuccess(response);
    });
    // .fail((response) => {
    //   onTemplateError(response);
    // });
  }

  init();
});
