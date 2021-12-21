(function () {
    let username = "Adrenaline Agency";

    const isOverflown = ({
        clientHeight,
        scrollHeight
    }) => scrollHeight > clientHeight
    const resizeText = ({
        element,
        elements,
        minSize,
        maxSize,
        step,
        unit
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
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function fitTextToParent(selector) {
        var tmp = selector + 'tmp';
        var clone = $(selector).clone().attr('id', selector.replace('#', '') + 'tmp');
        $(selector).parent().append(clone);

        var str = $(tmp).html();
        var edt = str.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $(selector).html(edt);
        $(tmp).remove();
        resizeText({
            elements: document.querySelectorAll(selector),
            step: 0.25,
            minSize: 1,
            maxSize: 2.25,
            unit: 'em'
        })
    }

    function appendContent(data,i) {

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

        fitTextToParent('#message');

        console.log(index, "characters:", post.length)
    }

    function cycleFeed() {
        let $template = $('#feed');
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

    function init() {
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
    init();

})(jQuery);