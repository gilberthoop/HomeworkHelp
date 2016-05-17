var express = require("express");
var router = express.Router();
var Math = require("../../models/math");
var middleware = require("../../middleware");



// INDEX - show all math questions
router.get("/", function(req, res) {
    // get all math questions from db
    Math.find({}, function(err, allmath){
        if(err){
            console.log(err);
        } else{
            res.render("math/index", {
                math: allmath,
                currentUser: req.user
            });
        }
    }); 
});


// NEW - show form to create a new question
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("math/new");
});


// CREATE - add a new math question to db
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var question = req.body.question;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newMath = { title:title, question:question, author:author };
    // create a new question and save to db
    Math.create(newMath, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/math");
        }
    });
});



// SHOW - shows more info about the question
router.get("/:id", function(req, res) {
    // find the question with id
    Math.findById(req.params.id).populate("answers").exec(function(err,foundMath){
        if(err){
            console.log(err);
        } else{
            res.render("math/show", {math:foundMath});
        }
    });
});


// EDIT math question
router.get("/:id/edit", middleware.checkMathOwnership, function(req, res) {
    Math.findById(req.params.id, function(err, foundMath) {
        res.render("math/edit", {math: foundMath});
    });
});


// UPDATE math question
router.put("/:id", middleware.checkMathOwnership, function(req, res) {
    // find and update the question
    Math.findByIdAndUpdate(req.params.id, req.body.math, function(err, updatedMath) {
        if(err){
            res.redirect("/math");
        } else{
            res.redirect("/math/" + req.params.id);
        }
    });
});


// DESTROY math question
router.delete("/:id", middleware.checkMathOwnership, function(req, res) {
    Math.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/math");
        } else{
            res.redirect("/math");
        }
    });
});



module.exports = router;







