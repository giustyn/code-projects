$(function () {
    const userName = "Adrenaline Agency",
        userIcon = "./img/adr-brandmark.jpg",
        timerDuration = 8000,
        animeDuration = 1000,
        revealerSpeed = parseInt($(':root').css('--revealer-speed')),
        feeds = [],
        dataURI = [
            local = "c:\\data\\social\\social.json",
            server = "https://kitchen.screenfeed.com/social/data/r4r9qm9zg5jb4hspckpqyqzwj.json"
        ];

    function fitText(el) {
        resizeText({
            elements: document.querySelectorAll(el),
            step: 0.1,
            minSize: 1,
            maxSize: 3,
            unit: 'em'
        })
    }

    function isolateHashtag(el) {
        // var tmp = el + 'tmp';
        // var clone = $(el).clone().attr('id', el.replace('#', '') + 'tmp');
        // $(el).parent().append(clone);
        var edt = $(el).html().replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $(el).html(edt);
        // $(tmp).remove();

        // $("#message").html($("#message").html().replace(/#([^ ]+)/g, "<span class='hashtag'>$1</span>"));
        // $('#message').html($("#message").text().replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>"))
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
        $transition.addClass('revealer--animate').addClass(shuffle).delay(revealerSpeed).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(shuffle).dequeue();
        });
    }
    
    function animateFeed($template) {
        var item = $template[0];
        console.warn(item)
        var animateIn = anime.timeline({
                easing: 'easeOutQuart',
                duration: animeDuration,
                autoplay: false,
                loop: false
            })
            .add({
                begin: function(){
                    revealer();
                },
            })
            .add({
                targets: item,
                opacity: [0, 1],
                delay: anime.stagger(40),
                translateX: [100, 0],
            })

        animateIn.play();
    }

    function animateTemplate($container, $template, data, current) {
        const $clone = $template.clone();
        let ProfileImageUrl = data.User.ProfileImageUrl,
            ProfileUserName = data.User.Name;

        if (!data.User.ProfileImageUrl === true) {
            // use default instagram image & username
            ProfileImageUrl = userIcon;
            ProfileUserName = userName;
        }

        $clone.attr("id", current).css('z-index', feeds.length - current).removeClass('hidden');
        $clone.find('#socialicon .icon').attr('src', data.ProviderIcon);
        $clone.find('#username').text(ProfileUserName);
        $clone.find('#useraccount').text(data.User.Username);
        $clone.find('#usericon .icon').attr('src', ProfileImageUrl);
        $clone.find('#message').text(data.Content);
        $clone.find('#posted').text(data.DisplayTime);
        $clone.find('#media .video').attr('src', data.Images[0].Url);
        $clone.find('#media .photo').css('background-image', 'url(' + (data.Images[0].Url) + ')');
        $container.append($clone);

        fitText('#message');
        isolateHashtag('#message'); // not working
        animateFeed($clone);

        setTimeout(function () {
            $clone.remove();
        }, timerDuration + (revealerSpeed / 2));
    }

    function iterateAnimations() {
        let current = 0;
        const $template = $("article");
        const $container = $("#main");

        console.log(current, feeds[current])
        animateTemplate($container, $template, feeds[current], current);
        // current += 1;
        current = (current + 1) % feeds.length;

        setInterval(function () {
            console.log(current, feeds[current])
            animateTemplate($container, $template, feeds[current], current);
            // current += 1;
            current = (current + 1) % feeds.length;
        }, timerDuration);

        $template.remove();
    }

    function getData() {
        $.get(dataURI[1])
            .done(function (response) {
                $.each(response.Items, function (i) {
                    feeds.push(response.Items[i]);
                })
                iterateAnimations();
                // setData(response);
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