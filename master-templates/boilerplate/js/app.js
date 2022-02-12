$(function () {
  var url = new ExtendedURL(window.location.href);

  const userName = "ADR",
    userIcon = "./img/adr-logo.svg",
    animeDuration = 750,
    timerDuration = 10000,
    revealerSpeed = parseInt($(":root").css("--revealer-speed"));

  const category = ["news", "celeb", "sports"][0],
    indexes = getRandomIndexes(10),
    dataURI = {
      local: "c:\\data\\" + category + "\\",
      server: "https://retail.adrenalineamp.com/rss/Xnews/" + category + "/",
    };

  function loadFeeds() {
    getArticles(dataURI.server, indexes).done((response) => {
      console.log(response);
    });
  }

  loadFeeds();
});
