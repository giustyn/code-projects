function ExtendedURL(href) {
  this.url = new URL(href);
  this.getSearchParam = function (param) {
    return this.url.searchParams.get(param)
  };
  return this;
}

function Article(xml, index, basePath) {
  this.story = xml ? $(xml).find("story").text() : null;
  this.image = new Image();
  this.image.src = basePath + index + ".jpg";
  return this;
}

function getIndexes(length) {
  var index = Math.floor(Math.random() * 10);
  var indexes = [];

  for (var i = 0; i < length; i++) {
    if (index + i >= 10) index = -1;
    indexes.push(index + i);
  }
  return indexes;
}

function getRandomIndexes(max) {
  var indexes = [];
  for (var i = 0; i < max; i++) {
    indexes.splice(Math.floor(Math.random() * indexes.length), 0, i);
  }
  return indexes;
}

function request(filePath, dataType) {
  var dfd = $.Deferred();
  $.ajax({
    url: filePath,
    type: "GET",
    dataType: dataType,
    error: function () {
      return dfd.resolve({
        status: 400
      });
    },
    success: function (response) {
      return dfd.resolve(response);
    }
  });
  return dfd.promise();
}

function xmlRequest(path) {
  var dfd = $.Deferred();
  var xhttp = new XMLHttpRequest();
  var regex = new RegExp(/(?=&)(?:(?!&amp;|&lt;|&gt;|&quot;|&apos;|[a-zA-Z\d\s]).){1}/, "g");
  xhttp.onload = function () {
    // console.log(xhttp.responseText)
    var parser = new DOMParser();
    return dfd.resolve(parser.parseFromString(xhttp.responseText.replace(regex, "&amp;"), "text/xml"));
  };

  xhttp.onerror = function (err) {
    // console.log(err)
    return dfd.reject(err);
  };

  xhttp.open("GET", path, true);
  xhttp.send();
  return dfd.promise();
}

function xmlFallbackRequest(basePath, articleNums) {
  var dfd = $.Deferred();
  $.when.apply($, $.map(articleNums, function (i) {
      return xmlRequest(basePath + i + ".xml");
    }))
    .done(function (...results) {
      return dfd.resolve(results);
    })
    .fail(function () {
      return dfd.resolve();
    });
  return dfd.promise();
}

function getArticles(basePath, articleNums, fallback) {
  var articles = [];
  var dfd = $.Deferred();
  xmlFallbackRequest(basePath, articleNums)
    .done(function (results) {
      if (!results) {
        return dfd.resolve({
          articleNums: articleNums
        });
      }
      // console.log(results);
      articles = $.map(results, function (result, i) {
        // console.log(result)
        return new Article(result, articleNums[i], basePath);
      });
      return dfd.resolve({
        articles: articles
      });
    });
  return dfd.promise();
}

function getWeather(basePath, zipcode) {
  var url = new URL(window.location.href);
  return $.when(
      // request(basePath + zipcode + ".json", "JSON") // Retail server
      request(basePath + zipcode, "JSON")
    )
}