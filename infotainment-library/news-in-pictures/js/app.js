$(function () {

    const url = new ExtendedURL(window.location.href),
        timerDuration = 5000,
        screenConfig = 1;

    let folderName = url.getSearchParam("category") || ["news", "sports", "celeb"][0],
        current = 0,
        feeds = [],
        videoIntro = [{
            "news": "",
            "sports": "P",
            "celeb": "",
            "fin": ""
        }][0],
        $bumper = $("#bumper").attr("src", "./video/News_Intro.mp4" + videoIntro[folderName]),
        dataURI = [
            local = "c:\\data\\",
            server = "http://kitchen.screenfeed.com/feed/aTUXjUPcmUehRVEnTVvX6Q.json"
        ];


    function ExtendedURL(href) {
        this.url = new URL(href);
        this.getSearchParam = function (param) {
            return this.url.searchParams.get(param)
        };
        return this;
    }

    function revealer() {
        const $transition = $('.revealer'),
            mode = [
                'revealer--left',
                'revealer--right',
                'revealer--top',
                'revealer--bottom'
            ],
            shuffle = mode[(Math.random() * mode.length) | 0];
        $transition.addClass('revealer--animate').addClass(mode[1]).delay(revealerSpeed * 1.5).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(mode[1]).dequeue();
        });
    }

    function animateClone(element) {
        // Begin animation in-out
        let speed = 500,
            offset = (speed / 2),
            animate = anime.timeline({
                easing: 'easeInOutSine',
                loop: false,
                autoplay: false,
            })
            .add({
                targets: '.photo',
                opacity: [0, 1],
                duration: speed * 2
            })
            .add({
                targets: '.story, .title, .credit',
                opacity: [0, 1],
                translateY: ['100', '0'],
                // delay: anime.stagger(300),
            }, '-=' + (speed * 4))

        animate.play();
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
            iterateAnimations();
        }
    }

    function animateTemplate($container, $template, data) {
        const $clone = $template.clone();
        let imgUrl = data.Media[0].Url,
            title = data.Title,
            credit = data.Media[0].Credit;

        $clone.attr("id", current).css('z-index', 1).removeClass('hidden');
        $clone.find('.photo, .background').css('background-image', 'url(' + (imgUrl) + ')');
        $clone.find('.title').text(title);
        $clone.find('.credit').text(credit);
        $container.append($clone);

        animateClone();

        setTimeout(function () {
            // $clone.remove();
        }, timerDuration);

    }

    function iterateAnimations() {
        const $template = $("#template");
        const $container = $("main");

        animateTemplate($container, $template, feeds[current]);
        current++;

        setInterval(function () {
            animateTemplate($container, $template, feeds[current]);
            current = (current + 1) % feeds.length;
            console.log(current)
        }, timerDuration);
        // $template.remove();
    }

    function getData(dataURI) {
        $.get(dataURI)
            .done(function (response) {
                $.each(response.Items, function (i) {
                    feeds.push(response.Items[i]);
                    // console.log(feeds)
                })
                // iterateAnimations();
            })
            .always(function (response) {
                // $bumper.remove();
                $bumper[0].addEventListener("timeupdate", videoTimeUpdate, response);
                console.log("dataURI: " + dataURI);
            });
    }

    function init() {
        getData(dataURI[1]);
    }

    init();

});