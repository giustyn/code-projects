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

  function revealer(direction) {
    var animation = $("#transition");
    var duration = parseInt($(':root').css('--revealer-speed'));
    var effect = "revealer--animate" + " " + direction;
    animation.addClass(effect).delay(duration).queue(function () {
      $(this).removeClass(effect).dequeue();
    });
  }

  function splitText(content) {
    const text = document.querySelector(content);
    text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>");
  }

  function randomizeInt(num) {
    // generate unique random numbers within a range and store them to an array 
    var arr = [];
    while (arr.length < num) {
      var r = Math.floor(Math.random() * num) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr
  }

  function animateCounter(element, timer, delay) {
    var limit = Math.round(timer / 1000);
    let speed = 200;

    anime.timeline({
        easing: 'easeInOutElastic(.5, 1)',
        duration: 1500,
      })
      .add({
        targets: '.question',
        opacity: [0, 1],
        scale: [0, 1],
        translateX: ['100%', '0%'],
      }, '-=500')
      .add({
        targets: '.choices .option',
        delay: anime.stagger(speed),
        opacity: [0, 1],
        scale: [0, 1],
        translateX: ['100%', '0%'],
        translateY: ['100%', '0%'],
      }, '-=1200')
      .add({
        targets: '.counter, .timer',
        opacity: [0, 1],
        scale: [2, 1],
        // translateX: ['50%', '0%'],
        rotateX: '180deg',
        translateY: ['100%', '0%'],
        delay: anime.stagger(speed),
        endDelay: timer
      }, '-=1000')
      .add({
        targets: '.choices .option',
        delay: anime.stagger(speed),
        opacity: [1, 0],
        scale: [1, 0],
      }, '-=1500');

    anime.timeline({
        loop: false,
        delay: timer,
      })
      .add({
        targets: '.answer',
        rotateX: '180deg',
        opacity: [0, 1],
        endDelay: delay
      });

    function countdownTimer() {
      var count = limit;
      var interval = setInterval(function () {
        count--
        $(".timer").text(count);
        // Display 'count' wherever you want to display it.
        // console.log(limit, count)
        if (count == 0) {
          // Display a login box
          clearInterval(interval);
        }
      }, 1000);
    }
    countdownTimer();

    function progressBar() {
      var animateProgress = anime({
        targets: 'progress',
        value: [0, 100],
        autoplay: true,
        easing: 'linear',
        duration: timer
      });
      // document.querySelector('body').onclick = animateProgress.restart;
      animateProgress.restart;
    }
    progressBar();
  }

  function buildAnimatedSlide(todo, index, timer, delay, template, container) {
    let clone = template.clone();
    let node = clone.get();
    let $revealer = parseInt($(':root').css('--revealer-enabled'));

    clone.attr("id", index).removeClass("hidden");
    clone.find(".question").html(todo.question);
    clone.find(".option.a").html(todo.A);
    clone.find(".option.b").html(todo.B);
    clone.find(".option.c").html(todo.C);
    clone.find(".option.d").html(todo.D);
    clone.find(".answer").html(todo.answer);

    container.append(clone);
    template.parent().remove();

    animateCounter(".counter", timer);

    setTimeout(function () {
      clone.remove();
    }, timer + delay)

    if ($revealer != 0) {
      revealer("revealer--right");
    }
  }

  function animateContent() {
    // let data = "http://kitchen.screenfeed.com/feed/m9z8nmyas3pd4qkrnj7te7ye0.json";
    let data = "./data/trivia.json";
    let timer = parseInt($(':root').css('--countdown-timer'));
    let delay = 4000;

    $.ajax(data)
      .done((todos) => {
        let index = 0;
        let limit = todos.length;
        // let limit = 10; // max number of content items
        let randomInt = randomizeInt(limit);
        let template = $(".trivia");
        let container = $(".container");

        console.log('Total Item(s):', todos.length);
        console.log('Item Limit:', limit);
        console.log('Timer:', timer);

        anime.timeline({
            targets: 'header *',
            easing: 'easeInOutElastic(.5, 1)',
            duration: 1000
          })
          .add({
            opacity: [0, 1],
            delay: anime.stagger(100),
            // translateX: ['-100%', '0%'],
            translateY: ['100%', '0%'],
          }, '+=0')

        console.log(randomInt[index], todos[randomInt[index]]);
        buildAnimatedSlide(todos[randomInt[index]], index, timer, delay, template, container);
        index++;
        let intervalId = setInterval(function () {
          console.log(randomInt[index], todos[randomInt[index]]);
          buildAnimatedSlide(todos[randomInt[index]], index, timer, delay, template, container);
          index++;
          if (index >= limit) {
            index = 0;
            clearInterval(intervalId);
          }
        }, timer + delay);
      });
  }

  function init() {
    setDateTime();
    animateContent();
  }

  init();
});