var express = require("express");
var router = express.Router();
var Science = require("../../models/science");
var middleware = require("../../middleware");



// INDEX - show all science questions
router.get("/", function(req, res) {
    // get all science questions from db
    Science.find({}, function(err, allScience){
        if(err){
            console.log(err);
        } else{
            res.render("science/index", {
                science: allScience,
                currentUser: req.user
            });
        }
    }); 
});


// NEW - show form to create a new question
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("science/new");
});


// CREATE - add a new science question to db
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var question = req.body.question;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newSci = { title:title, question:question, author:author };
    // create a new question and save to db
    Science.create(newSci, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/science");
        }
    });
});



// SHOW - shows more info about the question
router.get("/:id", function(req, res) {
    // find the question with id
    Science.findById(req.params.id).populate("answers").exec(function(err,foundScience){
        if(err){
            console.log(err);
        } else{
            res.render("science/show", {science:foundScience});
        }
    });
});


// EDIT science question
router.get("/:id/edit", middleware.checkScienceOwnership, function(req, res) {
    Science.findById(req.params.id, function(err, foundScience) {
        res.render("science/edit", {science: foundScience});
    });
});


// UPDATE science question
router.put("/:id", middleware.checkScienceOwnership, function(req, res) {
    // find and update the science question
    Science.findByIdAndUpdate(req.params.id, req.body.science, function(err, updatedSci) {
        if(err){
            res.redirect("/science");
        } else{
            res.redirect("/science/" + req.params.id);
        }
    });
});


// DESTROY science question
router.delete("/:id", middleware.checkScienceOwnership, function(req, res) {
    Science.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/science");
        } else{
            res.redirect("/science");
        }
    });
});


module.exports = router;