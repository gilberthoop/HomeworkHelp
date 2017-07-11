var express = require("express");
var router = express.Router();
var History = require("../../models/history");
var middleware = require("../../middleware");



// INDEX - show all history questions
router.get("/", function(req, res) {
    // get all history qs from db
    History.find({}, function(err, allHistory){
        if(err){
            console.log(err);
        } else{
            res.render("history/index", 
            {
                history: allHistory,
                currentUser: req.user
            });
        }
    });
});


// NEW - show form to create a new q
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("history/new");
});


// CREATE - add a new history q to db
router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.title;
    var question = req.body.question;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newHistory = { title:title, question:question, author:author };
    // create a new q and save to db
    History.create(newHistory, function(err, newlyCreated) {
        if(err){
            console.log(err);
        } else{
            res.redirect("/history");
        }
    });
});


// SHOW - shows more info about the q
router.get("/:id", middleware.checkHistoryQuestion, function(req, res) {
    // find the q with id
    History.findById(req.params.id).populate("answers").exec(function(err, foundHistory){
        if(err){
            console.log(err);
        } else{
            res.render("history/show", {history:foundHistory});
        }
    });
});


// EDIT - edit the math question
router.get("/:id/edit", middleware.checkHistoryOwnership, function(req, res) {
    History.findById(req.params.id, function(err, foundHistory) {
        res.render("history/edit", {history: foundHistory});
    });
});


// UPDATE - math question
router.put("/:id", middleware.checkHistoryOwnership, function(req, res) {
    // find and update the correct question
    History.findByIdAndUpdate(req.params.id, req.body.history, function(err, updatedHist){
        if(err){
            res.redirect("/history");
        } else{
            res.redirect("/history/" + req.params.id);
        }
    });
});


// DESTROY - delete a question
router.delete("/:id", middleware.checkHistoryOwnership, function(req, res){
    History.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/history");
        } else{
            res.redirect("/history");
        }
    });
});
 


module.exports = router;