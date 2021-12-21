(function () {
    let username = "Adrenaline Agency";

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function spotlightHashtags() {
        var str = $('#messagetmp').html();
        var edt = str.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $('#message').html(edt);
        $('#messagetmp').remove();
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
        let index = getRandomInt(data.Items.length),
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
        $('#messagetmp').text(post);
        $('#posted').text(last);
        spotlightHashtags();

        const isOverflown = ({ clientHeight, scrollHeight }) => scrollHeight > clientHeight
        const resizeText = ({ element, elements, minSize = 10, maxSize = 62, step = 1, unit = 'px' }) => {
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

        resizeText({
            elements: document.querySelectorAll('#message'),
            step: 0.5
          })

        console.log("characters:", post.length)

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
})(jQuery);