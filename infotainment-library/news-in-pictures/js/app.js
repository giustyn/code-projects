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
        let $revealer = $('.revealer');
        let speed = parseInt($(':root').css('--revealer-speed'));
        let enabled = parseInt($(':root').css('--revealer-enabled'));
        if (enabled != 0) {
            $revealer.addClass(direction).show();
            $revealer.addClass('revealer--animate').delay(speed * 2).queue(function (next) {
                $(this).removeClass(direction);
                $(this).removeClass('revealer--animate');
                $(this).hide();
                next();
            });
        } else {
            $revealer.remove();
        }
    }

    function buildAnimatedSlide(response, index, timer, template, container, limit) {
        let clone = template.clone();
        let node = clone.get();
        clone.attr("id", index);
        clone.find(".title").html(response.Title);
        clone.find(".credit").html(response.Media[0].Credit);
        clone.find(".photo, .background").css({
            "background-image": "url(" + response.Media[0].Url + ")"
        });
        container.append(clone);
        template.remove();

        // console.log(response.Title);
        // console.log(response.Media[0].Url);
    }

    function setContent(timer, data, limit) {
        $.ajax(data)
            .done((response) => {
                let index = 0;
                let template = $("#template");
                let slider = $("#slider");
                let intervalId = setInterval(function () {
                    // console.log(index, response.Items[index]);
                    buildAnimatedSlide(response.Items[index], index, timer, template, slider, limit);
                    index++;
                    if (index >= limit) {
                        clearInterval(intervalId);
                    }
                }, 0);
                // console.log(response.Items[index])
                // console.log('Total Item(s):', response.Items.length);
                console.log('Total Item(s):', limit);
                console.log('Animation Timer:', timer);
            }, 0);
    }

    function iterateCarousel(selector, limit, timer) {
        var crossfade = 750;
        var $articleContainer = $(selector);
        var index = 0;
        console.log("begin")

        function showArticle() {
            var $article = $articleContainer.children().eq(-index);

            $article.fadeIn(crossfade);
            setTimeout(function () {
                $article.fadeOut(crossfade);
            }, timer);
            index++;
            if (index >= limit) {
                index = 0;
            }
            revealer("revealer--left");
        }
        // showArticle();
        setInterval(showArticle, timer);
    }

    function animateContent(timer, data, limit) {
        let speed = parseInt($(':root').css('--anime-speed'));
        let index = 0;

        console.log("Start animation");
        setContent(timer, data, limit);

        iterateCarousel("section", limit, timer)

        // let animation = anime.timeline({
        //         target: 'section',
        //         loop: false,
        //         easing: 'easeOutExpo',
        //         duration: speed,
        //         opacity: 1,

        //     })
        // .add({
        //         targets: '.photo',
        //         // translateX: ['100%', '0%'],
        //         // opacity: [0, 1],
        //     }, speed)
        //     .add({
        //         targets: '.story',
        //         opacity: [0, 1],
        //         translateX: ['100%', '0%'],
        //     })
        //     .add({
        //         targets: '.title',
        //         opacity: [0, 1],
        //         translateX: ['20%', '0%'],
        //         endDelay: timer,
        //     })
        //     .add({
        //         targets: '.photo',
        //         translateX: ['0%', '100%'],
        //     }, timer - speed);
        // setTimeout(function () {
        //     clone.remove();
        // }, timer)
        // revealer("revealer--left");
    }

    function init() {
        let limit = parseInt($(':root').css('--article-limit'));
        let timer = parseInt($(':root').css('--article-duration'));
        let data = "http://kitchen.screenfeed.com/feed/m9z8nmyas3pd4qkrnj7te7ye0.json";
        //   setDateTime();
        animateContent(timer, data, limit);
    }

    init();
});