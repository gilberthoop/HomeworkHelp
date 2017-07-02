var express = require("express");
var router = express.Router({mergeParams: true});
var Science = require("../../models/science");
var Answer = require("../../models/answer");
var middleware = require("../../middleware");


// =======================
// Answers ROUTES for Science
// =======================

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Science.findById(req.params.id, function(err, science) {
        if(err){
            console.log(err);
        } else{
            res.render("answers/science/new", {science:science})
        }
    });
});


// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    Science.findById(req.params.id, function(err, science) {
        if(err){
            console.log(err);
            res.redirect("science");
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
                    science.answers.push(answer);
                    science.save();
                    req.flash("success", "Comment added!");
                    res.redirect("/science/" + science._id);
                }
            });
        }
    });
});


// EDIT science answer
router.get("/:answer_id/edit", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findById(req.params.answer_id, function(err, foundAnswer) {
        if(err){
            res.redirect("back");
        } else{
            res.render("answers/science/edit", {science_id: req.params.id, answer: foundAnswer});
        }
    });
});


// UPDATE science answer
router.put("/:answer_id", middleware.checkAnswerOwnership, function(req, res) {
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer) {
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment changed!");
            res.redirect("/science/" + req.params.id);
        }
    });
});


// DESTROY science answer
router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res){
    Answer.findByIdAndRemove(req.params.answer_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment deleted!");
            res.redirect("/science/" + req.params.id);
        }
    });
});



module.exports = router;