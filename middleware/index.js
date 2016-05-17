var Math = require("../models/math");
var Science = require("../models/science");
var History = require("../models/history");
var Answer = require("../models/answer");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};


middlewareObj.checkMathOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Math.findById(req.params.id, function(err, foundMath){
            if(err) {
                req.flash("error", "MATH QUESTION NOT FOUND");
                res.redirect("/math");
            } else {
                // check ownership
                if(foundMath.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "ACCESS DENIED");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "LOG IN IS REQUIRED");
        res.redirect("back");
    }
}

middlewareObj.checkScienceOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Science.findById(req.params.id, function(err, foundSci) {
            if(err) {
                req.flash("error", "SCIENCE QUESTION NOT FOUND");
                res.redirect("/science");
            } else {
                // check ownership
                if(foundSci.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "ACCESS DENIED");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "LOG IN IS REQUIRED");
        res.redirect("back");
    }
}


middlewareObj.checkHistoryOwnership = function(req, res, next) {
    // check user log in
    if(req.isAuthenticated()) {
        History.findById(req.params.id, function(err, foundHist) {
            if(err) {
                req.flash("error", "HISTORY QUESTION NOT FOUND");
                res.redirect("/history");
            } else {
                // check ownership
                if(foundHist.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("erro", "ACCESS DENITED");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "LOG IN IS REQUIRED");
        res.redirect("back");
    }
}


middlewareObj.checkAnswerOwnership = function(req, res, next) {
    // check user log in
    if(req.isAuthenticated()) {
        Answer.findById(req.params.answer_id, function(err, foundAnswer) {
            if(err) {
                res.redirect("back");
            } else {
                // check ownership
                if(foundAnswer.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "ACCESS DENIED");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "LOG IN IS REQUIRED");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "LOG IN IS REQUIRED");
    res.redirect("/login");   
}



module.exports = middlewareObj;















