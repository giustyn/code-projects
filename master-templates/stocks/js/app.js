$(document).ready(function () {

    // const path = "c:/data/"; /* Production */
    // const path = "../../../_feeds/data/fin/"; /* Development */
    // const data = path + "pnc-markets.json"; /* Production */
    const data = "http://kitchen.screenfeed.com/financial/qa47q5pxd4ymm2xzgz7ke1fs0.json"; // Top 100
    const $speed = parseInt($(':root').css("--anime-speed"));
    const $timer = parseInt($(':root').css('--anime-duration'));
    const $delay = parseInt($(':root').css("--anime-delay"));
    const stagger = 150;
    const $bumper = $('#bumper').attr("src", "./video/PNC_Syn_Stocks.mp4");

    function getDate() {
        let date = $('.date').text(moment().format('dddd, MMMM Do'));
        let introDate = $(".intro-date").text(moment().format('dddd, MMMM Do'));
    }

    function revealer(direction) {
        let animation = $("#transition");
        let duration = parseInt($(':root').css('--revealer-speed'));
        let effect = "revealer--animate" + " " + direction;
        animation.addClass(effect).delay(duration).queue(function () {
            $(this).removeClass(effect).dequeue();
        });
    }

    function animateValue(selector, value) {
        var el = document.querySelector(selector);
        // console.log(el)
        anime({
            targets: el,
            innerText: [0, value],
            easing: "linear",
            round: true,
            update: function (a) {
                alert(a)
                const value = a.animations[0].currentValue;
                const formattedNumber = numeral(value).format("0,000,000");
                el.innerHTML = formattedNumber;
            }
        });
    }

    function animateSlide(timer) {
        anime.timeline({
                loop: false,
                easing: 'easeInOutExpo',
                duration: $speed,
                delay: anime.stagger(stagger, {
                    direction: 'reverse'
                }),
            })
            .add({
                targets: '.card',
                opacity: [0, 1],
                translateX: ['-100%', '0%']
            })
            .add({
                targets: '.wrapper, .company_name, .values *, .icon, .disclaimer',
                opacity: [0, 1],
                translateY: ['10%', '0%'],
                delay: anime.stagger(stagger, {
                    direction: 'normal'
                }),
                // endDelay: (timer / 2 - $delay)
            })
            // .add({
            //     targets: '.company_name, .values *, .icon, .disclaimer',
            //     opacity: [1, 0],
            //     translateY: ['0%', '10%'],
            //     delay: anime.stagger(stagger, {
            //         direction: 'normal'
            //     })
            // })
            // .add({
            //     targets: '.card',
            //     opacity: [1, 0],
            //     translateX: ['0%', '100%']
            // })
    }

    function buildAnimatedSlide(todo, index, timer, template, container) {
        let clone = template.clone();
        let node = clone.get();
        numeral.defaultFormat('0.00');
        for (let i = 0; i < $('.card', clone).length; i++) {
            var card = $('.card:nth-child(' + (i + 1) + ')', clone);
            var stockIndex = (index + i) % todo.stocks.length;
            var stock = todo.stocks[stockIndex];
            console.log(stockIndex, stock);
            card.find(".company_name").text(stock.company_name);
            card.find(".stock_name").text(stock.ticker);
            card.find(".change").text(numeral(stock.change).format());
            card.find(".percent").text(numeral(stock.change_percent).format());
            if (isNaN(stock.change) || stock.change <= 0) {
                card.find(".icon").addClass("change-down");
            } else {
                card.find(".icon").addClass("change-up");
                card.find(".change").addClass("positive");
                card.find(".percent").addClass("positive");
            }
        }
        container.append(clone);
        template.remove();
        animateSlide(timer);
        setTimeout(function () {
            clone.remove()
        }, timer)
    }

    function iterateStocks(data) {
        let template = $("#template");
        let container = $("#main");
        let index = 0;
        template.remove();
        buildAnimatedSlide(data, index, $timer, template, container);
        index = index + 2;
        let intervalId = setInterval(function () {
            buildAnimatedSlide(data, index, $timer, template, container);
            index = index + 2;
        }, $timer);
    }

    function animateIntro() {
        anime.timeline({
                targets: '.intro-date',
                loop: false,
                easing: 'easeInOutElastic(1,1)',
                easing: 'easeInOutExpo',
            })
            .add({
                duration: $speed,
                translateX: ['-100%', '0%'],
                opacity: [0, 1],
                delay: 1500
            })
            .add({
                opacity: [1, 0],
                delay: 1500
            })
            .add({
                targets: '.header, .header *',
                delay: anime.stagger(100),
                opacity: [0, 1],
                translateY: ['-100%', '0%'],
            });
    }

    function videoEventHandler(data) {
        function handler(event) {
            let eventItem = event.target;
            let current = Math.round(eventItem.currentTime * 1000);
            let total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < 500) {
                eventItem.removeEventListener("timeupdate", handler);
                iterateStocks(data);
                $bumper.parent().fadeOut($delay, function () {
                    $bumper.parent().remove();
                });
            }
        }
        animateIntro();
        return handler;
    }

    function videoEventListener(data) {
        let handler = videoEventHandler(data);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function getStocks(url) {
        $.ajax(url)
            .done((data) => {
                videoEventListener(data);
                console.log(data.stocks.length)
            })
            .fail(function (data) {
                console.error('Failed to load data.');
                $('#template').hide();
            });
    }

    function init() {
        getDate();
        getStocks(data);
    }

    init();
});