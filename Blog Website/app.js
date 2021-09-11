//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const object = {
  homeContent: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
  aboutContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
  contactContent: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
};

// Connect to MONGOOSE
mongoose.connect("mongodb://localhost:27017/BlogDB");

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: [true, "Error: No blog title was found."]
  },
  blogBody: {
    type: String,
    required: [true, "Error: No blog paragraph was found."]
  },
});

const Blog = mongoose.model("Blog", blogSchema);

const day1 = new Blog({
  blogTitle: "Day1",
  blogBody: "Welcome to Angela Anne's very first (and hopefully one of many) blogpost! I aim to add some registration and user categorized blogs so viewers can read what you have to say too. For now, enjoy what I have to offer and explore this site."
});
const day2 = new Blog({
  blogTitle: "Day2",
  blogBody: "I am Angela Anne L. Enriquez from the Queen City of the Philippine South. Mabuhay mga Sugbuanons and bangon mga Bisaya!"
});
const day3 = new Blog({
  blogTitle: "Day3",
  blogBody: "Let me know your thoughts on this site by contacting me at: 1234-5678."
});
const pageContents = [day1, day2, day3];

app.get("/", (request, response) => {
  const {
    homeContent
  } = object;

  Blog.find({}, (err, result) => {
    console.log("[INF] GET / : Blogs Table ", result);
    if (err) {
      console.log("[Error] GET / : ", err);
    } else if (result.length === 0) {
      Blog.insertMany(pageContents, (error) => {
        if (error) {
          console.log("[ERROR] GET / : INSERT MANY OPERATION : ", error);
        } else {
          console.log("[SUCC] GET / : INSERT MANY OPERATION : OK");
        }
      });
      response.redirect("/");
    } else {
      response.render("home", {
        homeContent: homeContent,
        content: result
      });
    }
  });
});

app.get("/about", (request, response) => {
  const {
    aboutContent
  } = object; //delete
  response.render("about", {
    content: aboutContent
  });
});

app.get("/contact", (request, response) => {
  const {
    contactContent
  } = object; //delete
  response.render("contact", {
    content: contactContent
  });
});



app.get("/compose", (request, response) => {
  response.render("compose");
});

app.post("/compose", (request, response) => {
  const newBlog = new Blog({
    blogTitle: request.body.contentTitle,
    blogBody: request.body.contentBody,
  });
  console.log("[INF] POST /compose : NEW BLOG : ", newBlog);
  newBlog.save();
  response.redirect("/");
});

app.get("/posts/:blogID", (request, response) => {
  const blogID = request.params.blogID;
  Blog.find({
    _id: blogID
  }, (err, result) => {
    if (err) {
      console.log("[ERROR] GET /posts/", blogID, " : FIND BLOG : ", err);
    } else {
      console.log("[INF] GET /posts/", blogID, " : FIND BLOG : ", result);
      response.render("posts", {
        contentTitle: result[0].blogTitle,
        contentBody: result[0].blogBody
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
