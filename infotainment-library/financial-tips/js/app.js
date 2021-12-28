$(document).ready(function () {

    let duration = 15000,
        data = [{
            "heading": "Financial Tip #76",
            "content": "Pay more than the minimum payment on your credit card each month. Even five dollars extra will save you interest."
        }, {
            "heading": "Financial Tip #12",
            "content": "Call your credit card company and ask to lower the interest rate."
        }, {
            "heading": "Financial Tip #5",
            "content": "Check your credit report. Your credit report can help determine your credit score."
        }, {
            "heading": "Financial Tip #53",
            "content": "Start an Emergency fund. Having money in savings to use for emergencies can keep you out of financial trouble."
        }, {
            "heading": "Financial Tip #107",
            "content": "Create a Budget. Sticking to it is one of the first steps to becoming financially independent."
        }, {
            "heading": "Financial Tip #115",
            "content": "Allocate at least 20% of your income towards financial priorities such as paying off debt, savings and retirement."
        }];

    function timeCode() {
        function Timer(timeout) {
            var self = this;
            this.interval = timeout ? timeout : 1000; // Default
            this.run = function (runnable) {
                setInterval(function () {
                    runnable(self);
                }, this.interval);
            };
        }
        var timer = new Timer(duration);
        timer.run(function (timer) {
            // console.log(timer.interval);
            console.warn("next");
        });
    }

    function loadVideo() {
        let video = $('#bg-video'),
            // source = 'video/Money - 69627.mp4';
            // source = 'video/Bills - 91260.mp4';
            // source = 'video/City - 6383.mp4';
            // source = 'video/Market-1034.mp4';
            // source = 'video/Pexels Videos 1797251.mp4';
            source = 'video/Falling Coins.mp4';
        video.attr('src', source);
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

    function animateClone() {
        // Wrap every letter in a span
        var headingWrapper = document.querySelector('.heading');
        var contentWrapper = document.querySelector('.content');
        headingWrapper.innerHTML = headingWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        contentWrapper.innerHTML = contentWrapper.textContent.replace(/\S/g, "<span class='word'>$&</span>");
        
        // Begin animation in-out
        let speed = parseInt($(':root').css('--anime-speed')),
            offset = (speed / 2),
            animate = anime.timeline({
                easing: 'easeInOutQuint',
                loop: false,
                autoplay: false,
                duration: speed
            })
            .add({
                targets: '.container',
                opacity: [0, 1],
                scaleY: [0, 1],
                scaleX: 1,
            })
            .add({
                targets: '.letter',
                opacity: [0, 1],
                delay: anime.stagger(30)
                // translateX: ['20%', '0%'],
            }, '-=' + offset + '')
            .add({
                targets: '.word',
                opacity: [0, 1],
                delay: anime.stagger(15),
                endDelay: (duration / 2)
            }, '-=' + offset + '')
            .add({
                targets: '.letter, .word',
                opacity: [1, 0],
                delay: anime.stagger(5)
            }, '-=' + offset + '')
            .add({
                targets: '.container',
                opacity: [1, 0],
                scaleY: [1, .25],
                duration: offset
            }, '-=' + offset + '')

        animate.play();
    }

    function init() {
        loadVideo();
        cloneData();
    }
    
    init();
    // timeCode();
});