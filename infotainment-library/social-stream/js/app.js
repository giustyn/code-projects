$(function () {
    let username = "Adrenaline Agency",
        dataURI = [
            local = "c:\\data\\social\\social.json",
            server = "https://kitchen.screenfeed.com/social/data/r4r9qm9zg5jb4hspckpqyqzwj.json"
        ],
        transition = true,
        timerDuration = 5000,
        speed = 1500;

    function fitText(el) {
        resizeText({
            elements: document.querySelectorAll(el),
            step: 0.1,
            minSize: 1,
            maxSize: 2,
            unit: 'em'
        })
    }

    function isolateHashtag(el) {
        var tmp = el + 'tmp';
        var clone = $(el).clone().attr('id', el.replace('#', '') + 'tmp');
        $(el).parent().append(clone);
        var edt = $(tmp).text().replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $(el).html(edt);
        $(tmp).remove();
    }

    function animateFeed() {
        let speed = 1000,
            animateIn = anime.timeline({
                easing: 'easeOutQuart',
                duration: speed,
                autoplay: false,
                loop: false
            })
            .add({
                targets: '#content',
                // opacity: [0, 1],
                delay: anime.stagger(50),
                translateY: [100, 0],
            })
        animateIn.play();
    }

    function revealer() {
        const $transition = $('.revealer'),
            mode = [
                'revealer--left',
                'revealer--right',
                'revealer--top',
                'revealer--bottom'
            ],
            shuffle = mode[(Math.random() * mode.length) | 0]
        // console.log(shuffle);

        $transition.addClass('revealer--animate').addClass(shuffle).delay(speed).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(shuffle).dequeue();
        });
    }

    function setData(data) {
        let feed = data.Items,
            $template = $('#feed'),
            $container = $('#main');
            
            $.each(feed, function (i, el) {

                let $clone = $template.clone();
                $clone.attr('id', i).css('z-index', feed.length - i);
                $clone.find('#socialicon').css('background-image', 'url(' + (el.ProviderIcon) + ')');
                $clone.find('#username').text(el.User.Name);
                $clone.find('#useraccount').text(el.User.Username);
                $clone.find('#usericon').css('background-image', 'url(' + (el.User.ProfileImageUrl) + ')');
                $clone.find('#message').text(el.Content);
                $clone.find('#posted').text(el.DisplayTime);
                $clone.find('#media .video').attr('src', el.Images[0].Url);
                $clone.find('#media .photo').css('background-image', 'url(' + (el.Images[0].Url) + ')');
                $container.append($clone);
                console.log(i, el);
                
                // in
                setTimeout(() => {
                    fitText('#message');
                    isolateHashtag('#message');
                    revealer();
                    // animateFreed();
                }, i * timerDuration);

                // out
                setTimeout(() => {
                    $clone.remove();
                }, i * timerDuration + 1000);
            });
        $template.remove();
    }

    function iterate() {
        let currentIndex = 0;
        setInterval(() => {

        }, timerDuration);
    }

    function getData() {
        $.get(dataURI[1])
            .done(function (response) {
                setData(response);
                console.log("dataURI: " + dataURI[1]);
            })
            .always(function () {
                // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
            });
    }

    function init() {
        getData();
    }

    init();

});