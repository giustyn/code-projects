(function () {

    const url = new ExtendedURL(window.location.href),
        timerDuration = 10000,
        screenConfig = 1;

    let folderName = url.getSearchParam("category") || ["news", "sports", "celeb"][0],
        loadedStories = [],
        currentStory = 0,
        videoIntro = [{
            "news": "",
            "sports": "P",
            "celeb": "",
            "fin": ""
        }][0],
        $bumper = $("#bumper").attr("src", "./video/News_Intro.mp4" + videoIntro[folderName]),
        dataURI = [
            local = "c:\\data\\",
            server = "http://kitchen.screenfeed.com/feed/m9z8nmyas3pd4qkrnj7te7ye0.json"
        ];


    function ExtendedURL(href) {
        this.url = new URL(href);
        this.getSearchParam = function (param) {
            return this.url.searchParams.get(param)
        };
        return this;
    }

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

    function animateClone(element) {
        // Begin animation in-out
        let speed = 1500,
            offset = (speed / 2),
            animate = anime.timeline({
                easing: 'easeInOutSine',
                loop: false,
                autoplay: false,
            })
            .add({
                targets: '.photo',
                scale: [1.025, 1],
                duration: speed * 4
            })
            .add({
                targets: '.story, .title, .credit',
                opacity: [0, 1],
                translateY: ['100', '0'],
                delay: anime.stagger(300),
            }, '-=' + (speed * 4))

        animate.play();
    }

    function cycleFeed(data) {
        console.log(data)
        let feed = data.Items,
            $container = $('#main'),
            $template = $('#template'),
            $clone = $template.clone(),
            interval = 10000,
            index = 0;

        $template.remove();

        $.each(feed, function (i, el) {
            let imgUrl = el.Media[0].Url,
                title = el.Title,
                credit = el.Media[0].Credit;
            setTimeout(() => {
                console.log(i, el);
                $clone.find('.photo, .background').css('background-image', 'url(' + (imgUrl) + ')');
                $clone.find('.title').text(title);
                $clone.find('.credit').text(credit);
                $container.append($clone.attr('id', i));
                animateClone($clone);
                revealer('revealer-left');
            }, i * timerDuration);
        });
    }


    function videoTimeUpdate(event, data) {
        const eventItem = event.target;
        const current = Math.round(eventItem.currentTime * 1000);
        const total = Math.round(eventItem.duration * 1000);
        if ((total - current) < 500) {
            eventItem.removeEventListener("timeupdate", videoTimeUpdate);
            $($bumper).fadeOut(500, function () {
                $($bumper).parent().remove();
            });
            cycleFeed(data)
        }
    }

    function getData() {
        $.get(dataURI[1])
            .done(function (data) {
                cycleFeed(data);
            })
            .always(function (data) {
                $bumper[0].addEventListener("timeupdate", videoTimeUpdate, data);
                console.log("dataURI: " + dataURI[1]);
            });
    }

    function init() {
        // loadVideo();
        getData();
    }

    init();

})(jQuery);