$(function () {
  const $revealerSpeed = parseInt($(":root").css("--revealer-speed")),
    animeDuration = 1000,
    timerDuration = 5000,
    indexes = getRandomIndexes(10),
    category = ["news", "celeb", "sports"][0],
    dataURI = {
      local: "c:\\data\\" + category + "\\",
      server:
        "https://retail.adrenalineamp.com/rss/Xnews/" + category + "/1920/",
      // server: "https://retail.adrenalineamp.com/rss/Hnews/" + category + "/1920/",
      // server: "https://retail.adrenalineamp.com/rss/Hnews/canada/1920/",
    };

  let feeds = [],
    item = 0;

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

  function animateItem(index) {
    let article = document.getElementById(index),
      content = article.querySelector(".message");

    content.innerHTML = content.textContent.replace(
      /\S/g,
      "<span class='word'>$&</span>"
    );

    var animateIn = anime
      .timeline({
        // easing: 'easeInOutQuad',
        // easing: "easeInOutExpo",
        easing: "cubicBezier(0.645, 0.045, 0.355, 1.000)",
        duration: animeDuration,
        autoplay: true,
        loop: false,
      })
      .add({
        begin: function () {
          revealer();
        },
      })
      .add(
        {
          targets: article.querySelectorAll(".media .feature"),
          delay: anime.stagger(100, { direction: "reverse" }),
          opacity: [0, 1],
          // scale: [0.5, 1],
          // rotateX: [90, 0],
          translateX: ["200%", "0%"],
        },
        0
      )
      .add(
        {
          targets: article.querySelectorAll(".word"),
          delay: anime.stagger(20),
          opacity: [0, 1],
          translateX: ["200%", "0%"],
          // endDelay: timerDuration - animeDuration * 2,
        },
        300
      )
      .add({
        targets: article,
        // begin: ()=> alert('test')
      });
  }

  function animateTemplate($container, $template, data) {
    item++;
    const $clone = $template
      .clone()
      .attr("id", item)
      .css("z-index", item)
      .removeClass("hidden");

    $clone.find(".media img").attr("src", data.image.src);
    $clone.find(".message").text(data.story);
    $container.append($clone);

    let article = document.getElementById(item),
      message = article.querySelectorAll(".message");
    resizeText({ elements: message });
    isolateTag({ element: message });

    animateItem(item);

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + $revealerSpeed);
  }

  function iterateAnimations() {
    const $template = $("article").remove();
    const $container = $("main");

    /*     $.each(indexes, function (i) {
      // feeds.push(result.Items[i]);
      console.log(indexes[i]);
      animateTemplate($container, $template, feeds[indexes[i]]);
    }); */
    // console.log(current, feeds[current])
    animateTemplate($container, $template, feeds[item]);
    item++;

    setInterval(function () {
      // console.log(item, feeds[item])
      animateTemplate($container, $template, feeds[item]);
      item = (item + 1) % feeds.length;
    }, timerDuration);
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
      onTemplateSuccess(response);
    });
    // .fail((response) => {
    //   onTemplateError(response);
    // });
  }

  init();
});
