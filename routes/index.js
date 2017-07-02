var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require("request");


// root route
router.get("/", function(req, res) { 
    res.render("home"); 
});




    // request("https://publish.twitter.com/oembed?url=https%3A%2Ftwitter.com%2FStackOverflow%2Fstatus%2F756066231376052225", function(error, response, body) {
    //     if(!error && response.statusCode == 200) {
    //         var data = JSON.parse(body)
    //         res.render("home", {data: data});
    //     }
    // }); 


// =================================
// AUTH ROUTES
// =================================

// SHOW reg form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({ username:req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            var errMessage = err.message + ". Please choose a new username";
            req.flash("error", errMessage); 
            res.redirect("/register");
            //return res.render("register"); - Might cause error
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Homework Help, " + user.username);
            res.redirect("/");
        });
    });
});

// SHOW login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
    {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
);
 

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Now logged out.");
    res.redirect("/");
});


 
module.exports = router;