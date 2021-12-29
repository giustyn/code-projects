$(document).ready(function () {

    // Config variables
    var url = new ExtendedURL(window.location.href);
    var feed = url.getSearchParam("feed") || $(':root').css('--feed-type').trim(), // news, sports, celeb, fin, weather, markets
        style = url.getSearchParam("style") || $(':root').css('--feed-style').trim(), // default, classic, modern
        zipcode = url.getSearchParam("zipcode") || "63017",
        showIntro = parseInt(url.getSearchParam("intro") || $(':root').css('--intro-video')),
        showHeader = parseInt(url.getSearchParam("header") || $(':root').css('--header-enabled')),
        showRevealer = parseInt(url.getSearchParam("revealer") || $(':root').css('--revealer-enabled')),
        showLogo = parseInt(url.getSearchParam("logo") || 1),
        $clrPrimary = url.getSearchParam("primary") || $(':root').css('--clr-primary'),
        $clrSecondary = url.getSearchParam("secondary") || $(':root').css('--clr-secondary'),
        $clrTertiary = url.getSearchParam("tertiary") || $(':root').css('--clr-tertiary'),
        $aosDuration = parseInt($(':root').css('--aos-duration')),
        $aosDelay = parseInt($(':root').css('--aos-delay')),
        $articleDuration = parseInt($(':root').css('--article-duration')),
        $articleLimit = parseInt($(':root').css('--article-limit')),
        $screenConfig = url.getSearchParam("screens") || $(':root').css('--screen-config').trim(),
        $bumper = $('#bumper'),
        $revealer = $('#transition');

    // Local variables
    var localHost = 0;
    var introVideo = "/video/intro_news.webm";
    // var localBasePath = "c:/data";
    var localBasePath = "../../_feeds/data";
    var localFeeds = {
        news: localBasePath + "/news/",
        celeb: localBasePath + "/celeb/",
        sports: localBasePath + "/sports/",
        fin: localBasePath + "/fin/",
        markets: localBasePath + "/fin/",
        weather: localBasePath + "/weather/"
    }

    // Server variables
    var serverBasePath = "https://retail.adrenalineamp.com";
    var serverFeeds = {
        assets: serverBasePath + "/navori/assets/",
        news: serverBasePath + "/rss/Xnews/news/1920/",
        celeb: serverBasePath + "/rss/Xnews/celeb/1920/",
        sports: serverBasePath + "/rss/Xnews/sports/1920/",
        fin: serverBasePath + "/rss/Hnews/fin/1920/",
        markets: serverBasePath + "/rss/markets/",
        weatherimg: serverBasePath + "/rss/weather/1920/",
        weather: serverBasePath + "/navori/weather-json/"
        // weather: "https://kitchen.screenfeed.com/weather/v2/data/40778ps5v9ke2m2nf22wpqk0sj.json?current=true&interval=Daily&forecasts=5&location="
    };

    function setQueryParams() {
        function setWeatherLayout(type) {
            if (type === "modern") {
                $("#weather #static").remove();
            } else {
                $('#weather #bg-video').remove();
                $('#weather #dynamic').remove();
            }
        }
        if (showIntro === 0) {
            console.log("intro: " + showIntro);
            $bumper.parent().remove();
        }
        if (showRevealer === 0) {
            console.log("revealer: " + showRevealer);
            // $('#story-template').attr("data-aos", "fade-down");
            $revealer.remove();
        }
        if (showHeader === 0) {
            console.log("header: " + showHeader);
            $(".header-overlay").remove();
        }
        if (showLogo === 0) {
            console.log("logo: " + showLogo);
            $("#logo").remove();
        }
        if (style !== null) {
            console.log("style: " + style);
            $(".photo").addClass(style);
            $(".story-container").addClass(style);
            setWeatherLayout(style);
            if (style === "default") {
                // $('.story-wrapper').attr("data-aos", "fade");
            } else if (style === "classic") {
                // $('article').attr("data-aos", "fade");
                // $(".photo").attr("data-aos", "fade").attr("data-aos-delay", $aosDelay);
            } else if (style === "modern") {
                // $('.story-wrapper').attr("data-aos", "fade-left");
                // $(".photo").attr("data-aos", "fade-right").attr("data-aos-delay", $aosDelay);
                // $(".photo").removeClass("ken-burns");
            }
        }
        if ($clrPrimary !== null) {
            console.log("primary:" + $clrPrimary);
            // $(':root').css('--clr-primary', $clrPrimary);
        }
        if ($clrSecondary !== null) {
            console.log("secondary:" + $clrSecondary);
            // $(':root').css('--clr-secondary', $clrSecondary);
        }
        if ($clrTertiary !== null) {
            console.log("tertiary:" + $clrTertiary);
            // $(':root').css('--clr-tertiary', $clrTertiary);
        }
        console.log("screen layout:" + $screenConfig);
        if ($screenConfig === "1") {
            $(':root').addClass('single-screen');
            $('#news-dual').remove();
        } else if ($screenConfig === "2") {
            $(':root').addClass('dual-screen');
        } else if ($screenConfig === "3") {
            $(':root').addClass('triple-screen');
        }
        if (feed === 'weather') {
            $(".feed").remove();
            $("#markets").remove();
            loadWeather();
        }
        if (feed === 'markets') {
            $(".feed").remove();
            $("#weather").remove();
            loadMarkets();
        }
        if (feed === 'fin') {
            $(".story-container").remove();
            $(".header-overlay").remove();
            $(".photo").removeClass("ken-burns");
        }
        if (feed !== 'markets' && feed !== 'weather') {
            $("#markets").remove();
            $("#weather").remove();
            loadFeeds();
        }
    }

    function dayPartGreeting() {
        var hours = new Date().getHours();
        var greeting;
        if (hours >= 0 && hours < 12) {
            greeting = ('Good morning,');
        } else if (hours >= 12 && hours < 17) {
            greeting = ('Good afternoon,');
        } else if (hours >= 17 && hours < 24) {
            greeting = ('Good evening,');
        }
        return greeting;
    }

    function getDate() {
        var todaysDate = moment().format('dddd MMMM D, YYYY');
        $(".current-date").html(todaysDate);
    }

    function getTime() {
        var currentTime = moment().format('h:mm A');
        var timeRefresh = 60000;
        $(".current-time").html(currentTime);
        // setInterval(function () {
        //     getTime();
        // }, timeRefresh);
    }

    function getMarketData(basePath) {
        // var dfd = $.Deferred();        
        var bgvideo = serverFeeds['assets'] + "/markets/video/markets.webm";
        return $.when(xmlRequest(basePath)
            .done(function (response) {
                var xml = $(response);
                var row = $("#individualStock");
                var container = $("#marketData");
                row.remove().removeClass("aos-animate");
                xml.find("Quote").each(function (index, quote) {
                    var clone = row.clone();
                    var $quote = $(quote);
                    var change = $quote.find("change").text();
                    var ispos = change.includes("+");
                    var isneg = change.includes("-");
                    var $changeImg = clone.find("#changeValue");
                    if (ispos) {
                        $changeImg.removeClass("changeZero").addClass("changeUp");
                    } else if (isneg) {
                        $changeImg.removeClass("changeZero").addClass("changeDown");
                    }
                    setTimeout(function () {
                        row.addClass("aos-animate");
                        clone.find("#stockName").text($quote.find("company_name").text().replace("Composite", "").trim());
                        clone.find("#lastPrice").text($quote.find("last").text());
                        clone.find("#changeValueNum").text($quote.find("change").text());
                        clone.find("#percentchangeValue").text($quote.find("change_percent").text());
                        container.append(clone);
                    }, ($aosDuration / 1.5) * index);
                });
                console.log(response);
            })
        );
    }

    function marketVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Show market data
                // 
                // Remove intro video
                $bumper.parent().fadeOut($aosDuration, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function marketVideoEventListeners(response, path) {
        if (showIntro === 0) {
            // 
            return;
        }
        var handler = marketVideoUpdate(response, path);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function loadMarkets() {
        var local = localFeeds['markets'] + "markets.xml";
        var server = serverFeeds['markets'] + "markets.xml";
        var assets = "./assets/";
        getMarketData(server)
            .done(function () {
                console.log("local market data found");
                $bumper.attr("src", assets + introVideo);
                $('#bg-video').attr("src", assets + "markets.webm");
            })
            .catch(function () {
                console.log("server market data found");
                $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                $('#bg-video').attr("src", serverFeeds['assets'] + "/markets/video/markets.webm");
                getMarketData(server);
            })
    }

    function setWeather(weather) {
        var location = weather.Locations[0] || {};
        var current = location.WeatherItems[0] || {};
        var forecast = location.WeatherItems.slice(2, 6) || {};
        var iconPath = "assets/img/icons-line-animated/";
        if (localHost === 1) {
            var videoPath = "assets/video/";
        } else {
            var videoPath = serverFeeds['assets'] + "/weather/video/";
        }

        $("#current-bg-video").attr({
            src: videoPath + getVideo(current.ConditionCode),
            type: "video/mp4"
        });

        $(".salutation").text(dayPartGreeting());
        $(".current-location").html(location.City);
        $(".current-condition").html(current.Description);
        $(".current-temp").html(current.CurrentTempF + "°");
        $(".current-icon").attr("src", iconPath + getIcon(current.ConditionCode));
        $(".current-high").html("HIGH " + current.HighTempF + "°");
        $(".current-low").html("LOW " + current.LowTempF + "°");
        $(".current-pop").html("RAIN " + (current.ChanceOfPrecip || 0) + "%");
        $(".current-wind").html("WIND " + (current.WindSpeedMph || 0) + " mph");
        $(".current-humidity").html("HUMIDITY " + (current.Humidity || 0) + "%");
        $("#forecast .day").each(function (i, el) {
            var $el = $(el);
            $el.find(".icon").attr("src", iconPath + getIcon(forecast[i].ConditionCode));
            $el.find(".forecast-day").text(moment(forecast[i].DateTime).format('dddd'));
            $el.find(".forecast-temp").text(forecast[i].HighTempF + "°");
        });
    }

    function weatherVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Start animations
                setWeather(response);
                $aosInit.addClass("aos-animate");
                $revealer.addClass("revealer--animate");
                // Remove intro video
                $bumper.fadeOut($aosDuration, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function weatherVideoEventListeners(response) {
        if (showIntro === 0) {
            $aosInit.addClass("aos-animate");
            setWeather(response);
            return;
        }
        var handler = weatherVideoUpdate(response);
        $bumper[0].addEventListener("timeupdate", handler);
    }

    function loadWeather() {
        var location = zipcode + ".json";
        var local = localFeeds['weather'];
        var server = serverFeeds['weather'];
        var imageURL = serverFeeds['weatherimg'] + zipcode + ".jpg";
        getWeather(local, "weather.json")
            .done(function (response) {
                if (response.status !== 400) {
                    console.log("Fetching local data..");
                    console.log(response.Locations[0]);
                    $(".weather-photo").css("background-image", "url(" + local + "weather.jpg")
                    $bumper.attr("src", "./assets" + introVideo);
                    $aosInit.removeClass("aos-animate");
                    weatherVideoEventListeners(response, local);
                } else {
                    return getWeather(server, location)
                        .done(function (response) {
                            localHost = 0;
                            console.log("Local data not found. Fetching server data..");
                            console.log("source: " + server + location);
                            $(".weather-photo").css("background-image", "url('" + imageURL + "')");
                            $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                            $aosInit.removeClass("aos-animate");
                            weatherVideoEventListeners(response, server);
                        });
                }
            });
    }

    function appendArticleComponents(selector, articles) {
        var $template = $("#story-template");
        var $frag = $(document.createDocumentFragment());
        $template.parent().remove();
        articles.forEach(function (article, index) {
            var storyClone = $template.clone();
            storyClone.attr("id", "story" + index).removeClass("aos-animate").hide();
            var $storyText = storyClone.find(".story-headline");
            $storyText.html(article.story);
            storyClone.find(".photo").css("background-image", "url(" + article.image.src + ")");
            storyClone.find(".photo-bg").css("background-image", "url(" + article.image.src + ")");
            $frag.append(storyClone);
        });

        $frag.appendTo($(selector));
    }

    function iterateArticleCarousel(selector) {
        var $articleContainer = $(selector);
        var index = 0;

        function showArticle() {
            var $article = $articleContainer.children().eq(index);
            // console.log($($article))
            $revealer.addClass('revealer--animate').delay(($aosDuration * 2)).queue(function (next) {
                $(this).removeClass('revealer--animate');
                next();
            });
            $article.removeClass('aos-animate').show();
            $article.addClass('aos-animate');
            setTimeout(function () {
                $article.fadeOut($aosDuration + $aosDelay);
            }, ($articleDuration + ($aosDuration + $aosDelay)));
            index++;
            if (index >= $articleLimit) {
                index = 0;
            }
        }
        showArticle();
        setInterval(showArticle, $articleDuration + ($aosDuration + $aosDelay));
    }

    function handleArticleCarousel(articles) {
        if ($screenConfig >= "2") {
            $articleLimit = $articleLimit / 2;
            appendArticleComponents(".news-single", articles.slice(0, articles.length / 2));
            iterateArticleCarousel(".news-single");
            appendArticleComponents(".news-dual", articles.slice(articles.length / 2));
            iterateArticleCarousel(".news-dual");
        } else {
            appendArticleComponents(".news-single", articles);
            iterateArticleCarousel(".news-single");
        }
    }

    function articlesVideoUpdate(response) {
        function handler(event) {
            const eventItem = event.target;
            const current = Math.round(eventItem.currentTime * 1000);
            const total = Math.round(eventItem.duration * 1000);
            // console.log(current, total)
            if ((total - current) < $aosDuration) {
                eventItem.removeEventListener("timeupdate", handler);
                // Show articles
                handleArticleCarousel(response.articles);
                // Remove intro video
                $bumper.parent().fadeOut($aosDuration, function () {
                    $bumper.parent().remove();
                });
            }
        }
        return handler;
    }

    function articleVideoEventListeners(response, path) {
        $('.feed').find('*').removeClass("aos-animate");
        if (showIntro === 0) {
            handleArticleCarousel(response.articles);
            return;
        }
        var handler = articlesVideoUpdate(response, path);
        $bumper[0].addEventListener("timeupdate", handler);
    } 

    function loadFeeds() {
        var location = zipcode + ".json";
        var server = serverFeeds[feed];
        var local = server; // localFeeds[feed];
        var indexes = getRandomIndexes($articleLimit);
        getArticles(local, indexes)
            .done(function (response) {
                if (response.articles) {
                    console.log("Loading local data..");
                    console.log("source: " + local, '\n', response.articles);
                    getWeather(localFeeds['weather'], "weather.json")
                        .done(function (response) {
                            setWeather(response);
                        });
                    $bumper.attr("src", "./assets/" + introVideo);
                    articleVideoEventListeners(response, local);
                } else {
                    return getArticles(server, indexes)
                        .done(function (response) {
                            localHost = 0;
                            console.log("Local data not found. Fetching server data..");
                            console.log("source: " + server, '\n', response.articles);
                            getWeather(serverFeeds['weather'], location)
                                .done(function (response) {
                                    setWeather(response);
                                });
                            $bumper.attr("src", serverFeeds['assets'] + feed + introVideo);
                            articleVideoEventListeners(response, server);
                        });
                }
            });
    }

    function init() {
        AOS.init({
            // Global settings:
            disableMutationObserver: false, // disables automatic mutations' detections (advanced)
            // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
            offset: 0, // offset (in px) from the original trigger point
            delay: $aosDelay, // values from 0 to 3000, with step 50ms
            duration: $aosDuration, // values from 0 to 3000, with step 50ms
            easing: 'ease-in-out', // default easing for AOS animations
            once: false, // whether animation should happen only once - while scrolling down
            mirror: false, // whether elements should animate out while scrolling past them
            anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
        });
        $aosInit = $(".aos-init");
        console.log("aos-duration: " + $aosDuration);
        console.log("aos-delay: " + $aosDelay);
        setQueryParams();

        getDate();
        getTime();
    }

    init();

});