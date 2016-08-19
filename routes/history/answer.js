var express = require("express");
var router = express.Router({mergeParams: true});
var History = require("../../models/history");
var Answer = require("../../models/answer");
var middleware = require("../../middleware");


// ============================
// Answers ROUTES for History
// ============================

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    History.findById(req.params.id, function(err, history) {
        if(err){
            console.log(err);
        } else{
            res.render("answers/history/new", {history:history});
        }
    });
});


// CREATE the answer
router.post("/", middleware.isLoggedIn, function(req, res) {
    History.findById(req.params.id, function(err, history) {
        if(err){
            console.log(err);
            res.redirect("history");
        } else{
            Answer.create(req.body.answer, function(err, answer) {
                if(err){
                    req.flash("error", "OOOPS... Something went wrong");
                    console.log(err);
                } else{
                    // add username and id to answer
                    answer.author.id = req.user.id;
                    answer.author.username = req.user.username;
                    // save the answer
                    answer.save();
                    history.answers.push(answer);
                    history.save();
                    req.flash("success", "COMMENT ADDED");
                    res.redirect("/history/" + history._id);
                }
            });
        }
    });
});


// EDIT the answer
router.get("/:answer_id/edit", middleware.checkAnswerOwnership, function(req, res){
    Answer.findById(req.params.answer_id, function(err, foundAnswer) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("answers/history/edit", {history_id: req.params.id, answer: foundAnswer});
        }
    });
});


// UPDATE the answer
router.put("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "COMMENT CHANGED");
            res.redirect("/history/" + req.params.id);
        }
    });
});


// DESTROY the answer
router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndRemove(req.params.answer_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "COMMENT DELETED");
            res.redirect("/history/" + req.params.id);
        }
    });
});
 
 


module.exports = router;