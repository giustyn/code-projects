/**
 *  API Components
 */

function ExtendedURL(href) {
  this.url = new URL(href);
  this.getSearchParam = function (param) {
    return this.url.searchParams.get(param);
  };
  return this;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomIndexes(max) {
  var indexes = [];
  for (var i = 0; i < max; i++) {
    indexes.splice(Math.floor(Math.random() * indexes.length), 0, i);
  }
  return indexes;
}

function isOverflown({ clientHeight, scrollHeight }) {
  return scrollHeight > clientHeight;
}

function resizeText({
  element,
  elements,
  minSize = 1,
  maxSize = 2.5,
  step = 0.01,
  unit = "em",
}) {
  (elements || [element]).forEach((el) => {
    let i = minSize;
    let overflow = false;

    const parent = el.parentNode;

    while (!overflow && i < maxSize) {
      el.style.fontSize = `${i}${unit}`;
      overflow = isOverflown(parent);

      if (!overflow) i += step;
    }
    // revert to last state where no overflow happened
    el.style.fontSize = `${i - step}${unit}`;
  });
}

function isolateTag({ element, elements }) {
  (elements || [element]).forEach((el) => {
    let hashTag = $(el)
      .last()
      .html()
      .replace(/(^|\s)(#[a-z\d-]+)/gi, "$1<span class='hashtag'>$2</span>");
    $(el).last().html(hashTag);
  });
}

/**
 * @typedef {*} ajax.GET
 */

function request(filePath, dataType) {
  var dfd = $.Deferred();
  $.ajax({
    url: filePath,
    type: "GET",
    dataType: dataType,
    error: function () {
      return dfd.resolve({
        status: 400,
      });
    },
    success: function (response) {
      return dfd.resolve(response);
    },
  });
  return dfd.promise();
}

function getWeather(basePath, zipcode) {
  var url = new URL(window.location.href);
  return $.when(request(basePath + zipcode, "JSON"));
}

/**
 * @typedef {*} XMLHttpRequest
 */

function xmlRequest(path) {
  var dfd = $.Deferred();
  var xhttp = new XMLHttpRequest();
  var regex = new RegExp(
    /(?=&)(?:(?!&amp;|&lt;|&gt;|&quot;|&apos;|[a-zA-Z\d\s]).){1}/,
    "g"
  );
  xhttp.open("GET", path, true);

  xhttp.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      // console.log(xhttp.responseText)
      var parser = new DOMParser();
      return dfd.resolve(
        parser.parseFromString(
          xhttp.responseText.replace(regex, "&amp;"),
          "text/xml"
        )
      );
    } else {
      // We reached our target server, but it returned an error
      console.error('oops')
    }
  };

  xhttp.onerror = function (err) {
    // console.log(err)
    return dfd.reject(err);
  };

  xhttp.send();
  return dfd.promise();
}

function xmlFallbackRequest(basePath, articleNums) {
  var dfd = $.Deferred();
  $.when
    .apply(
      $,
      $.map(articleNums, function (i) {
        return xmlRequest(basePath + i + ".xml");
      })
    )
    .done(function (...results) {
      return dfd.resolve(results);
    })
    .fail(function () {
      return dfd.resolve();
    });
  return dfd.promise();
}

function article(xml, index, basePath) {
  this.story = xml ? $(xml).find("story").text() : null;
  this.image = new Image();
  this.image.src = basePath + index + ".jpg";
  return this;
}

function getArticles(basePath, articleNums) {
  var Items = [];
  var dfd = $.Deferred();
  xmlFallbackRequest(basePath, articleNums).done(function (results) {
    if (!results) {
      return dfd.resolve({
        articleNums: articleNums,
      });
    }
    // console.log(results);
    Items = $.map(results, function (result, i) {
      // console.log(result)
      return new article(result, articleNums[i], basePath);
    });
    return dfd.resolve({
      Items: Items,
    });
  });
  return dfd.promise();
}
