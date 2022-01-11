(function () {
    let username = "Adrenaline Agency";

    let dataURI = [
        local = "c:\\data\\social\\social.json",
        server = "http://kitchen.screenfeed.com/social/data/r4r9qm9zg5jb4hspckpqyqzwj.json"
    ];

    function fitTextToParent(selector) {
        var tmp = selector + 'tmp';
        var clone = $(selector).clone().attr('id', selector.replace('#', '') + 'tmp');
        $(selector).parent().append(clone);
        // (^|\s)(#[a-z\d-]+)
        var edt = $(tmp).text().replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $(selector).html(edt);
        $(tmp).remove();

        resizeText({
            elements: document.querySelectorAll(selector),
            step: 0.1,
            minSize: 1,
            maxSize: 2.25,
            unit: 'em'
        })
    }

    function revealer(mode) {

        let enabled = true,
            flow = ['revealer--left', 'revealer--right', 'revealer--top', 'revealer--bottom'],
            shuffle = flow[Math.floor(Math.random() * flow.length)];

        console.log(shuffle)
        let $transition = $('.revealer');
        let $speed = parseInt($(':root').css('--revealer-speed'));
        if (enabled == true) {
            $transition.show().addClass('revealer--animate ' + shuffle).delay($speed * 2).queue(function () {
                $(this).removeClass('revealer--animate ' + shuffle).hide().dequeue();
            });
        }
    }

    function animateFeed(interval) {

        let speed = 1000,
            animateIn = anime.timeline({
                easing: 'easeOutSine',
                loop: false,
                autoplay: false,
                duration: speed
            })
            .add({
                easing: 'easeOutQuart',
                targets: '#media',
                opacity: [0, 1],
            }, '+=' + speed)
            .add({
                targets: '#content',
                opacity: [0, 1],
                delay: anime.stagger(50),
                // translateX: ['-20%', '0%'],
            }, '-=' + speed),

            animateOut = anime.timeline({
                easing: 'easeInSine',
                loop: false,
                autoplay: false,
                duration: speed
            })
            .add({
                targets: 'article',
                opacity: [1, 0],
                delay: anime.stagger(10),
            })
        animateIn.play();
        // revealer(shuffle);
    }

    function cycleFeeds(data) {
        let feed = data.Items,
            $template = $('#feed'),
            $container = $('#main'),
            $clone = $template.clone(),
            interval = 7000,
            limit = 10,
            index = 0;
        $template.remove();
        $.each(feed, function (i, el) {
            let imgUrl = el.Images[0].Url,
                account = "@" + el.User.Username,
                icon = el.ProviderIcon,
                post = el.Content,
                last = el.DisplayTime;

            setTimeout(() => {
                console.log(i, el);
                $clone.attr('id', i);
                $clone.find('#socialicon').css('background-image', 'url(' + (icon) + ')');
                $clone.find('#profilename').text(username);
                $clone.find('#profileaccount').text(account);
                $clone.find('#message').text(post);
                $clone.find('#posted').text(last);

                function mediaVideoType() {
                    if (imgUrl.includes(".mp4?") != true) return false
                    $clone.find('#media video').attr('src', imgUrl).siblings().remove();
                    return true
                }
                if (mediaVideoType() != true) {
                    $clone.find('#media .photo').css('background-image', 'url(' + (imgUrl) + ')');
                    $clone.find('#media video').remove();
                };

                // todos: fix fittexttoparent
                fitTextToParent('#message');

                $container.append($clone);
                animateFeed(interval);
            }, i * interval);
        });
    }

    function getData() {
        $.get(dataURI[1])
            .done(function (data) {
                cycleFeeds(data);
            })
            .always(function () {
                // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
                console.log("dataURI: " + dataURI[1]);
            });
    }

    function init() {
        // loadVideo();
        getData();
    }

    init();

})(jQuery);