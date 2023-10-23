// $(document).ready(function() {
//   window.defaultTemplate = {
//       "template": "bank style 2-A",
//       "textValues":[
//           { "name":"text1", "length":25, "value":"<b>Accounts</b> that<br>give you more." },
//           { "name":"text2", "length":25, "value":"Find the right account<br>for you." },
//           { "name": "text3", "length": 26, "value": "Open in-person or online" },
//           { "name":"text4", "length":415, "value": "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui te feugait." }
//       ],
//       "imageValues":[
//           { "name":"image1", "height":1920, "width": 1080, "image":"bank_image_2a.png" }
//       ]
//   };
// });

window.defaultTemplate = {
  Status: {
    Code: 200,
    Message: "defaultMedia",
    Type: "defaultTemplate",
  },
  Items: [
    {
      ContentId: "0",
      User: {
        Id: "0",
        Username: "",
        Name: "",
        ProfileImageUrlSmall: null,
        ProfileImageUrl: "",
      },
      Images: [
        {
          Url: "./img/BMO_FollowUs_BokehBlue.png",
          Width: 1080,
          Height: 1080,
        },
      ],
      Content: "<div class='logo'><img src='./img/bmo-logo_blue.svg'></div>",
      Provider: 0,
      ProviderIcon: "",
      CreatedDate: "",
      DisplayTime: "",
      IsRetweet: false,
      IsSelected: false,
    },
  ],
};