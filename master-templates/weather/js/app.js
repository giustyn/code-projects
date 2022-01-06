(function () {
    const url = new ExtendedURL(window.location.href),
        $bumper = $('#bumper'),
        $animeDelay = parseInt($(':root').css('--anime-delay')),
        $animeDuration = parseInt($(':root').css('--anime-duration')),
        $animeSpeed = parseInt($(':root').css('--anime-speed')),
        $animeStagger = parseInt($(':root').css('--anime-stagger')),
        
        data = "c:\\data\\weather\\weather.json", // production
        devData = "../../../_feeds/data/weather/weather.json", // development
        devDataURL = "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location=03801";  // development

    var videoEnabled = url.getSearchParam("bgvideo") || 1,
        screenConfig = url.getSearchParam("screens") || 1;

    function getDate() {
        var date = moment().format('dddd, MMMM Do');
        $('.date').html(date);
    }

    function getOS() {
        var parser = new UAParser();
        var ua = navigator.userAgent;
        var result = parser.getResult();
        var os = result.os.name;
        console.log(os);

        if (os != "Windows" && os != "Mac OS") {
            videoEnabled = 0;
        }
    }

    function dayPartGreeting(target) {
        let hours = new Date().getHours();
        let txt;
        if (hours >= 0 && hours < 12) {
            txt = ('Good morning');
        } else if (hours >= 12 && hours < 17) {
            txt = ('Good afternoon');
        } else if (hours >= 17 && hours < 24) {
            txt = ('Good evening');
        }
        $(target).text(txt);
    }

    function revealer(direction) {
        let $transition = $('.revealer');
        let $enabled = parseInt($(':root').css('--revealer'));
        let $speed = parseInt($(':root').css('--revealer-speed'));
        if ($enabled == 1) {
            $transition.addClass(direction).show();
            $transition.addClass('revealer--animate').delay($speed * 2).queue(function () {
                $(this).removeClass('revealer--animate ' + direction).hide().dequeue();
            });
        }
    }

    function handleWeather(data) {
        let location = data.Locations[0] || {};
        let current = location.WeatherItems[0] || {};
        let forecast = location.WeatherItems.slice(1, 6) || {};

        function cloneDayOfWeek(el, num) {
            var elem = document.querySelector(el);
            for (var i = 1; i <= num; i++) {
                var clone = elem.cloneNode(true);
                clone.id = 'day' + (num - i + 1);
                elem.after(clone);
            }
            elem.remove();
        }
        function setForecast() {
            cloneDayOfWeek('#template', 5);
            $(".forecast .day").each(function (i, el) {
                var $el = $(el);
                $el.find(".icon").attr("src", "./img/icons/" + getIcon(forecast[i].ConditionCode));
                $el.find(".dayofweek").text(moment(forecast[i].DateTime).format('ddd'));
                $el.find(".description").text(forecast[i].ShortDescription);
                $el.find(".htemp").text(forecast[i].HighTempF);
                $el.find(".ltemp").text(forecast[i].LowTempF);
                $el.find(".ltemp").text(forecast[i].LowTempF);
                $el.find("video").attr("poster", "./img/" + loadMedia(forecast[i].ConditionCode) + ".jpg");
                if (videoEnabled !== 0) {
                    $el.find("video").attr("src", "./video/" + loadMedia(forecast[i].ConditionCode) + ".mp4");
                }
            });
        }
        function setCurrent() {
            $('.day:first-child .dayofweek').replaceWith('<div class="dayofweek">TODAY</div>');
            $('.location').text(location.City);
            $('.temperature').text(current.CurrentTempF);
            $('.description').text(current.Description);
            $('.wind').text("Wind: " + Number(current.WindSpeedMph) + "mph");
            $('.humidity').text("Humidity: " + Number(current.Humidity) + "%");
            $(".header .icon").attr("src", "./img/icons/" + getIcon(forecast[0].ConditionCode));
        }
        function mainBgVideo() {
            $('.background video').attr("poster", "./img/" + loadMedia(forecast[0].ConditionCode) + ".jpg");
            if (videoEnabled !== 0) {
                $('.background video').attr("src", "./video/" + loadMedia(forecast[0].ConditionCode) + ".mp4");
            }
        }

        mainBgVideo();
        setForecast();
        setCurrent();
    }

    function animateIntro() {
        anime.timeline({
                targets: '#intro .date',
                // easing: 'easeInOutExpo',
                easing: 'easeInOutElastic(1,1)',
                duration: ($animeSpeed * 2)
            })
            /* intro content animation-in */
            .add({
                translateX: ['-100%', '0%'],
                delay: $animeSpeed,
                opacity: [0, 1],
                endDelay: 2000
            })
            /* intro content animation-out */
            .add({
                translateX: ['0%', '-100%'],
                opacity: [1, 0],
                duration: $animeSpeed,
            });
    }

    function animateWeather() {
        anime.timeline({
                autoplay: true,
                loop: false,
                easing: 'easeOutExpo',
                duration: $animeSpeed,
            })
            /* main content animation-in */
            .add({
                targets: '.container',
                opacity: [0, 1],
                changeBegin: function (anim) {
                    revealer('revealer--left');
                }
            }, '-=' + ($animeDelay) + '')
            .add({
                targets: '.header, .header .col *',
                delay: anime.stagger(50, {
                    direction: 'normal',
                    start: $animeDelay
                }),
                translateX: ['-100%', '0%'],
                opacity: [0, 1],
            }, '-=' + ($animeDelay) + '')
            .add({
                targets: '.day *',
                delay: anime.stagger($animeStagger, {
                    direction: 'normal',
                    start: $animeDelay
                }),
                translateX: ['-100%', '0%'],
                opacity: [0, 1],
                endDelay: $animeDuration
            }, '-=' + ($animeSpeed) + '')
            /* main content animation-out */
            .add({
                targets: '.forecast *, .day *',
                delay: anime.stagger($animeStagger, {
                    direction: 'reverse',
                    start: ($animeSpeed / 2)
                }),
                translateX: ['0%', '-100%'],
                opacity: [1, 0],
            }, '-=' + ($animeSpeed) + '')
            .add({
                targets: '.header, .header .col *',
                delay: anime.stagger(50, {
                    direction: 'reverse',
                    start: 0
                }),
                translateX: ['0%', '-100%'],
                opacity: [1, 0],
            }, '-=' + ($animeSpeed) + '')
            .add({
                targets: '.container',
                opacity: 0,
                changeBegin: function (anim) {
                    revealer('revealer--right');
                }
            }, '-=' + ($animeSpeed) + '');
    }

    function videoEventHandler(data) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            if ((total - current) < 500) {
                eventItem.removeEventListener("timeupdate", handler);
                handleWeather(data);
                animateWeather();
                $bumper.parent().fadeOut(500, function () {
                    $bumper.remove();
                });
            }
        }
        return handler;
    }

    function videoEventListener(data) {
        var handler = videoEventHandler(data);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function setLayout() {
        console.log("screen-config: " + screenConfig)
        if (screenConfig == 1) {
            $('section').addClass('single-screen')
            $bumper.attr("src", "./video/Z3-intro-weather-1s.webm")
        } else if (screenConfig == 2) {
            $('section').addClass('dual-screen')
            $bumper.attr("src", "./video/Z3-intro-weather-2s.webm")
        };
    }

    function errorHandler() {
        // $('#intro, #transition, .background video, .header, .forecast').remove();
        // $('.container, .photo').addClass('visible');
        console.log("Failed to get data.");
    }

    function getWeather(source) {
        $.ajax({
            cache: true,
            url: source,
            dataType: "json",
            beforeSend: function () {
                getDate();
                setLayout();
            },
            success: function (data) {
                animateIntro();
                videoEventListener(data);
                console.log(source);
                console.log(data.Locations[0]);
            },
            error: function () {
                errorHandler();
            }
        })
    }

    function init() {
        getOS();
        getWeather(devDataURL);
    }

    init();
})();