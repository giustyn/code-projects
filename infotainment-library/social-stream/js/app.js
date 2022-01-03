(function () {
    let username = "Adrenaline Agency";

    let dataURI = [
        local = "c:\\data\\social\\social.json",
        server = "http://kitchen.screenfeed.com/social/data/r4r9qm9zg5jb4hspckpqyqzwj.json",
        dev = "https://giustyn.github.io/code-projects/dummy-data/social/data.json"
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

    function revealer(direction) {
        let transition = 1;
        let $transition = $('.revealer');
        let $speed = parseInt($(':root').css('--revealer-speed'));
        if (transition == 1) {
          $transition.addClass(direction).show();
          $transition.addClass('revealer--animate').delay($speed * 2).queue(function () {
            $(this).removeClass('revealer--animate ' + direction).hide().dequeue();
          });
        }
      }

    function animateClone() {
        // Begin animation in-out
        let speed = 1200,
            stagger = 200,
            animate = anime.timeline({
                easing: 'easeInOutQuart',
                loop: false,
                autoplay: false,
                duration: speed
            })
            
            .add({
                easing: 'easeOutQuart',
                targets: '.photo.focus',
                opacity: [0, 1],
                // scale: [1.1,1],
            })
            .add({
                targets: '#socialicon',
                opacity: [0, 1],
                translateX: [20, 0],
            }, '-=' + speed)
            .add({
                targets: '#profile *',
                opacity: [0, 1],
                translateX: [-20, 0],
            }, '-=' + speed)
            .add({
                targets: '#messagewrap *',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(stagger),
                // translateX: ['20%', '0%'],
            }, '-=' + speed)

        animate.play();
    }

    function cycleFeed(data) {
        let feed = data.Items,
            $template = $('#template'),
            $container = $('#main'),
            $clone = $template.clone(),
            interval = 10000,
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
                $clone.find('#socialicon').css('background-image', 'url(' + (icon) + ')');
                $clone.find('#profilename').text(username);
                $clone.find('#profileaccount').text(account);
                $clone.find('#message').text(post);
                $clone.find('#posted').text(last);
                fitTextToParent('#message');
                // alert(imgUrl)
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

                $container.append($clone);
                animateClone($clone);
                revealer('revealer-left');
            }, i * interval);
        });
    }

    function getData() {
        $.get(dataURI[2])
            .done(function (data) {
                cycleFeed(data)
            })
            .always(function () {
                // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
                console.log("dataURI: " + dataURI[2]);
            });
    }

    function init() {
        // loadVideo();
        getData();
    }

    init();

})(jQuery);