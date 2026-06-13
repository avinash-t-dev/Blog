//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();

const homeStartingContent = "Welcome to Daily Insights, a platform where technology, innovation, and learning come together. Explore articles on software development, cloud computing, artificial intelligence, career growth, and emerging technologies. Whether you're a student, developer, or technology enthusiast, you'll find valuable content to expand your knowledge and stay updated with the latest trends in the digital world.";

const aboutContent = "Daily Insights is a technology-focused blog created to share knowledge, experiences, and industry trends. Our mission is to make technical concepts easy to understand while helping readers stay informed about modern software development, cloud technologies, artificial intelligence, and professional growth. We believe that continuous learning is the key to success in the rapidly evolving technology landscape.";

const contactContent = "We'd love to hear from you. Whether you have questions, feedback, collaboration opportunities, or suggestions for future articles, feel free to get in touch. Our goal is to build a community of learners and technology enthusiasts who are passionate about innovation and knowledge sharing. Thank you for visiting our blog and being part of our journey.";

const app = express();

const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});

const blogSchema=mongoose.Schema({
 title:String,
  content:String
});
const Blogs=mongoose.model("Blog",blogSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){
 Blogs.find({}).then(function(result){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: result
    });
 }).catch(function(err){
  console.log(err);
 });
 
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const posts=new Blogs({
    title: req.body.postTitle,
    content: req.body.postBody
  })
posts.save(function(err){
  if(!err)
  res.redirect("/");
});


});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
 
  // Find post by id
  Blogs.findOne({ _id: requestedPostId }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});