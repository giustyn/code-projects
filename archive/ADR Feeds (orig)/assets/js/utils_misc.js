
// function DailyForecast(day, temp, img, description) {
//   this.day = day;
//   this.temp = temp;
//   this.icon = getIcon(img);
//   this.description = description;
//   return this;
// }

// function scaleFontSize(element) {
//   var container = document.getElementById(element);

//   // Reset font-size to 100% to begin
//   container.style.fontSize = "100%";

//   // Check if the text is wider than its container,
//   // if so then reduce font-size
//   if (container.scrollWidth > container.clientWidth) {
//     container.style.fontSize = "70%";
//   }
// }

// function resizeFont(data) {
//   var textLength = data.length;
//   var maxChars = 120;

//   console.log("Story: " + data + " - Length: " + textLength + ", Max: " + maxChars);

//   if (textLength > maxChars) {
//     return {
//       'font-size': '6vh' // Reduce font size
//     };
//   }
//   return data;
// }

// function mapWeatherData(weather) {
//   return weather.time.startValidTime.reduce(function(acc, timestamp, i) {
//     if (i % 2 === 0) {
//       var url = new URL(weather.data.iconLink[i]);
//       acc.push(
//         new DailyForecast(
//           moment(timestamp).format('dddd'),
//           weather.data.temperature[(i % 2) + i],
//           url.searchParams.get('i') || url.pathname.split("/").pop(),
//           weather.data.weather[i].toLowerCase().split("then")[0].trim()
//         )
//       );
//     }
//     return acc;
//   }, []);
// }