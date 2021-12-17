$(document).ready(function () {

  function setDateTime() {
    var renderTime = function () {
      var clock = new Date();
      // Set date via Vanilla.js
      date.textContent = clock.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      // Set time via Vanilla.js
      time.textContent = clock.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        hour12: true
      });
    };
    renderTime();
    setInterval(renderTime, 1000);
  }

  function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  function revealer(direction) {
    let $revealer = $(':root').css('--revealer-enabled');
    if ($revealer != 0) {
      var animation = $("#transition");
      var duration = parseInt($(':root').css('--revealer-speed'));
      var effect = "revealer--animate" + " " + direction;
      animation.addClass(effect).delay(duration).queue(function () {
        $(this).removeClass(effect).delay(100).dequeue();
      });
    }
  }

  function buildAnimatedSlide(todo, index, timer, template, container) {
    let clone = template.clone();
    let node = clone.get();
    let $speed = parseInt($(':root').css("--anime-speed"));
    let $delay = parseInt($(':root').css("--anime-speed"));
    let $revealerSpeed = parseInt($(':root').css("--anime-speed"));

    numeral.defaultFormat('0.00');
    if (isNaN(todo.change) || todo.change <= 0) {
      clone.find("#icon").addClass("change-down");
    } else {
      clone.find("#icon").addClass("change-up");
      clone.find("#change").addClass("positive");
    }
    clone.attr("id", index).removeClass("hidden");
    clone.find("#company_name").text(todo.company_name); // .replace("Composite", "").trim())
    clone.find("#stock_name").text(todo.ticker);
    clone.find("#company_logo").attr({
      "src": todo.logo_small
    });
    clone.find("#last").text(numeral(todo.last).format());
    clone.find("#change").text(numeral(todo.change).format());
    clone.find("#percent").text(numeral(todo.change_percent).format());
    clone.find("#previous").text(numeral(todo.previous).format());
    clone.find("#day_open").text(numeral(todo.day_open).format());
    clone.find("#day_high").text(numeral(todo.day_high).format());
    clone.find("#day_low").text(numeral(todo.day_low).format());
    clone.find("#volume").text(numeral(todo.volume).format('0,0'));
    clone.find("#lastupdated").text(todo.time_last);
    container.append(clone);

    anime.timeline({
        targets: clone.find("#stock *").get(),
        easing: 'easeInOutElastic(2,2)',
      })
      .add({
        changeBegin: function () {
          revealer("revealer--right");
        }
      })
      .add({
        opacity: [0, 1],
        translateX: ['2%', '0%'],
        delay: anime.stagger(30, {
          direction: 'reverse'
        }),
        duration: $speed,
        endDelay: 3000,
      }, '-=' + $delay + '')
      .add({
        duration: $speed,
        opacity: [1, 0],
        translateX: ['0%', '2%'],
        rotateX: ['0', '2deg'],
        skew: ['0', '2deg'],
        delay: anime.stagger(15, {
          direction: 'reverse'
        }),
      })
      .add({
        changeBegin: function () {
          revealer("revealer--left");
        }
      }, '-=' + $delay + '')
    setTimeout(function () {
      clone.remove()
    }, timer)

    /* if ( index % 2 == 0) {
      revealer("revealer--bottom");
    } else {
      revealer("revealer--top");
    } */
  }

  function animateHeader() {
    let $speed = $(':root').css('--anime-speed');
    $("header *").css({
      "opacity": "0"
    });
    anime.timeline({
        targets: 'header *',
        // easing: 'easeInOutExpo',
        easing: 'easeInOutElastic(.5, 1)',
      })
      .add({
        opacity: [0, 1],
        duration: $speed,
        translateY: ['100%', '0%'],
        // rotate: ['5deg', '0'],
        // skew: ['15deg', '0'],
        delay: anime.stagger(120),
      }, '+=1000');
  }

  function animateStocks(timer) {
    $.ajax("http://kitchen.screenfeed.com/financial/qa47q5pxd4ymm2xzgz7ke1fs0.json")
      .done((todos) => {
        let index = 0;
        let template = $("#template");
        let container = $("#container");
        // let timer = $(':root').css('--anime-duration');
        animateHeader();
        buildAnimatedSlide(todos.stocks[index], index, timer, template, container);
        // console.log(index, todos.stocks[index]);
        index++;
        let intervalId = setInterval(function () {
          buildAnimatedSlide(todos.stocks[index], index, timer, template, container);
          // console.log(index, todos.stocks[index]);
          index++;
          if (index >= todos.stocks.length) {
            index = 0;
            // clearInterval(intervalId);
          }
        }, timer);
        console.log('Item(s):', todos.stocks.length);
      });
  }

  function init() {
    let timer = $(':root').css('--anime-duration');

    setDateTime();
    // animateProgress();
    animateStocks(timer);
  }

  init();
});