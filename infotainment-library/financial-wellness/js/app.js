$(function () {
  const userName = "Adrenaline Agency",
    userIcon = "./img/ADR_Logo_A_RGB.svg",

    animeDuration = 750,
    timerDuration = 10000,
    revealerSpeed = parseInt($(':root').css('--revealer-speed'));

  const dataURI = {
    "local": "c:\\data\\wellness\\content.json",
    "server": "./content.json"
  };

  let feeds = [],
    current = 0;

  function revealer() {
    const $transition = $('.revealer'),
      mode = [
        'revealer--left',
        'revealer--right',
        'revealer--top',
        'revealer--bottom'
      ],
      shuffle = mode[(Math.random() * mode.length) | 0];
    $transition.addClass('revealer--animate').addClass(shuffle).delay(revealerSpeed * 1.5).queue(function () {
      $(this).removeClass('revealer--animate').removeClass(shuffle).dequeue();
    });
  }

  function cloneData() {
    let $template = $('#template');
    let $container = $('#main');
    let $clone = $template.clone();
    $template.remove();
    $.each(data, function (i, el) {
      setTimeout(() => {
        console.log(el.heading, el.content);
        $clone.find('.heading').html(el.heading);
        $clone.find('.content').html(el.content);
        $container.append($clone);
        // animateClone($clone);
      }, i * duration);
    });
  }

  function animateClone() {
    // Wrap every letter in a span
    var headingWrapper = document.querySelector('.heading');
    var contentWrapper = document.querySelector('.content');
    headingWrapper.innerHTML = headingWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    contentWrapper.innerHTML = contentWrapper.textContent.replace(/\S/g, "<span class='word'>$&</span>");

    // Begin animation in-out
    let speed = parseInt($(':root').css('--anime-speed')),
      offset = (speed / 2),
      animate = anime.timeline({
        easing: 'easeInOutQuint',
        loop: false,
        autoplay: false,
        duration: speed
      })
      .add({
        targets: '.container',
        opacity: [0, 1],
        scaleY: [0, 1],
        scaleX: 1,
      })
      .add({
        targets: '.letter',
        opacity: [0, 1],
        delay: anime.stagger(30)
        // translateX: ['20%', '0%'],
      }, '-=' + offset + '')
      .add({
        targets: '.word',
        opacity: [0, 1],
        delay: anime.stagger(15),
        endDelay: (duration / 2)
      }, '-=' + offset + '')
      .add({
        targets: '.letter, .word',
        opacity: [1, 0],
        delay: anime.stagger(5)
      }, '-=' + offset + '')
      .add({
        targets: '.container',
        opacity: [1, 0],
        scaleY: [1, .25],
        duration: offset
      }, '-=' + offset + '')

    animate.play();
  }

  function animateTemplate($container, $template, data, current) {
    const $clone = $template.clone();

    $clone.attr("id", current).css('z-index', current).removeClass('hidden');
    $clone.find('.socialicon img').attr('src', data.ProviderIcon);
    $clone.find('.username').text(ProfileUserName);
    $clone.find('.useraccount').text(data.User.Username);
    $clone.find('.usericon img').attr('src', ProfileImageUrl);
    $clone.find('.message').text(data.Content);
    $clone.find('.published').text(data.DisplayTime);
    $container.append($clone);

    // animateItem($clone);

    setTimeout(function () {
      $clone.remove();
    }, timerDuration + (revealerSpeed * 2));
  }

  function iterateAnimations() {
    const $template = $("section");
    const $container = $("main");

    console.log(current, feeds[current])
    animateTemplate($container, $template, feeds[current], current);
    current++;

    setInterval(function () {
      // console.log(current, feeds[current])
      animateTemplate($container, $template, feeds[current], current);
      current = (current + 1) % feeds.length;
    }, timerDuration);

    $template.remove();
  }

  function buildFeedContent() {
    const feed = feeds[9];

    var $backdrop = $('video').attr('src',feed.Source.Media.VideoUrl);
  
    var $duration = $('.container').attr('data', feed.Duration);
    var $title = $('.title').html(feed.Source.Title);
    var $article = $("article");

    var $content = $(feed.Source.Content).each(function (i, el) {
      let $clone = $article.clone();
      $clone.attr('id', i);
      $clone.find('.text').html(el.Text);
      $clone.find('.source').html(el.Source);
      $article.parent().append($clone);
    })

    var $source = $('footer .source').html(feed.Source.Disclaimer.A?.Source);
    var $disclaimer = $('footer .disclaimer').html(feed.Source.Disclaimer.A?.Text);

    // console.log($source[0].innerHTML)
    $article.remove();
  }

  function onTemplateError(result) {
    console.warn("could not get data")
  }

  function onTemplateSuccess(result) {
    $.each(result.Items, function (i) {
      feeds.push(result.Items[i]);
    })
    buildFeedContent();
    // iterateAnimations();
    // console.log(feeds)
  }

  function getJsonData(onSuccess, onError, data) {
    return $.ajax({
      method: "GET",
      url: data,
      dataType: "json",
      success: function (result) {
        // console.log(result)
        onSuccess(result)
      },
      error: function (result) {
        // console.error(result);
        onError(result)
      }
    });
  }

  function init() {
    // getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
    getJsonData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
  }

  init();
});