var express = require("express");
var router = express.Router({mergeParams: true});
var Math = require("../../models/math");
var Answer = require("../../models/answer");
var middleware = require("../../middleware");


// =======================
// Answers ROUTES for Math
// =======================

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Math.findById(req.params.id, function(err, math) {
        if(err){
            console.log(err);
        } else{
            res.render("answers/math/new", {math:math})
        }
    });
});


// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    Math.findById(req.params.id, function(err, math) {
        if(err){
            console.log(err);
            res.redirect("math");
        } else{
            Answer.create(req.body.answer, function(err, answer) {
                if(err){
                    req.flash("error", "OOOPS... Something went wrong");
                    console.log(err);
                } else{
                    // add username and id to the answer
                    answer.author.id = req.user.id;
                    answer.author.username = req.user.username;
                    // save the answer
                    answer.save();
                    math.answers.push(answer);
                    math.save();
                    req.flash("success", "Comment added!");
                    res.redirect("/math/" + math._id);
                }
            });
        }
    });
});


// EDIT math answer
router.get("/:answer_id/edit", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findById(req.params.answer_id, function(err, foundAnswer) {
        if(err){
            res.redirect("back");
        } else{
            res.render("answers/math/edit", {math_id: req.params.id, answer: foundAnswer});
        }
    });
});


// UPDATE math answer
router.put("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment changed!");
            res.redirect("/math/" + req.params.id);
        }
    });
});


// DESTROY math answer
router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndRemove(req.params.answer_id, function(err) {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted!");
            res.redirect("/math/" + req.params.id);
        }
    });
});


module.exports = router;