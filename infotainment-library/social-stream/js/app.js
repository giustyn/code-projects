(function () {
    let username = "Adrenaline Agency";

    const isOverflown = ({
        clientHeight,
        scrollHeight
    }) => scrollHeight > clientHeight
    const resizeText = ({
        element,
        elements,
        minSize = 1,
        maxSize = 2.5,
        step = .25,
        unit = 'em'
    }) => {
        (elements || [element]).forEach(el => {
            let i = minSize
            let overflow = false

            const parent = el.parentNode

            while (!overflow && i < maxSize) {
                el.style.fontSize = `${i}${unit}`
                overflow = isOverflown(parent)

                if (!overflow) i += step
            }
            // revert to last state where no overflow happened
            el.style.fontSize = `${i - step}${unit}`
        })
    }

    function getRandomInt(min, max) {
        // return Math.floor(Math.random() * max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function spotlightHashtags(selector) {



        // <span id="messagetmp" class="component"></span>
        // var txt2 = $("<span></span>").text("Text.").attr('id', 'messagetmp').addClass('component');   // Create with jQuery

    }

    function cloneData() {
        let $template = $('#template');
        let $container = $('#main');
        let $clone = $template.clone();
        $template.remove();
        $.each(data, function (i, el) {
            setTimeout(() => {
                console.log(el.heading, el.content);
                $clone.find('.heading').html(el.heading);
                $clone.find('.content').html(el.content);
                $container.append($clone);
                animateClone($clone);
            }, i * duration);
        });
    }

    function appendContent(data) {

        let index = getRandomInt(0, data.Items.length),
            imgUrl = data.Items[index].Images[0].Url,
            account = "@" + data.Items[index].User.Username,
            icon = data.Items[index].ProviderIcon,
            post = data.Items[index].Content,
            last = data.Items[index].DisplayTime;

        function mediaVideoType() {
            if (imgUrl.includes(".mp4?") != true) return false
            $('#media video').attr('src', imgUrl).siblings().remove();
            return true
        }
        if (mediaVideoType() != true) {
            $('#media .photo').css('background-image', 'url(' + (imgUrl) + ')');
            $('#media video').remove();
        };
        $('#socialicon').css('background-image', 'url(' + (icon) + ')');
        $('#profilename').text(username);
        $('#profileaccount').text(account);
        $('#message').text(post);
        $('#posted').text(last);

        function clonePost(selector) {
            var tmp = selector + 'tmp';
            var clone = $(selector).clone().attr('id', selector.replace('#', '') + 'tmp');
            $(selector).parent().append(clone);

            var str = $(tmp).html();
            var edt = str.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
            $(selector).html(edt);
            $(tmp).remove();
        }
        clonePost('#message');

        resizeText({
            elements: document.querySelectorAll('#message'),
            step: 0.25
        })

        console.log(index, "characters:", post.length)

    }

    function readJson() {
        let url = "http://kitchen.screenfeed.com/social/data/r4r9qm9zg5jb4hspckpqyqzwj.json";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                console.log(json);
                appendContent(json);
            })
            .catch(function () {
                console.error("fail")
            })
    }
    readJson();

    $(window).resize(function () {
        $("#log").append("<div>Handler for .resize() called.</div>");
    });

})(jQuery);