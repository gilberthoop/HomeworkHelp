var Math = require("../models/math");
var Science = require("../models/science");
var History = require("../models/history");
var Answer = require("../models/answer");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};


// Math question SHOW validation
middlewareObj.checkMathQuestion = function(req, res, next) {
    // Check if the Math question exists
    Math.findById(req.params.id, function(err, foundMath) {
        if(err || foundMath === null) {
            req.flash("error", "Math question not found!");
            res.redirect("/math");
        } else{
            next();
        }
    });
}
// Math question EDIT & DELETEclear validation/auth
middlewareObj.checkMathOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Math.findById(req.params.id, function(err, foundMath){
            if(err || foundMath === null) {
                req.flash("error", "Math question not found!");
                res.redirect("/math");
            } else {
                // check ownership and check if author is not null
                if(foundMath.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Access denied!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Log in is required");
        res.redirect("back");
    }
}


// Science question SHOW validation
middlewareObj.checkScienceQuestion = function(req, res, next) {
    // Check if the Science question exists
    Science.findById(req.params.id, function(err, foundSci) {
        if(err || foundSci === null) {
            req.flash("error", "Science question not found!");
            res.redirect("/science");
        }
        else {
            next();
        }
    });
}
// Science question EDIT & DELETE validation/auth
middlewareObj.checkScienceOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Science.findById(req.params.id, function(err, foundSci) {
            if(err || foundSci === null) {
                req.flash("error", "Science question not found!");
                res.redirect("/science");
            } else {
                // check ownership
                if(foundSci.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Access denied!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Log in is required");
        res.redirect("back");
    }
}


// History question SHOW validation
middlewareObj.checkHistoryQuestion = function(req, res, next) {
    // Check if the History question exists
    History.findById(req.params.id, function(err, foundHist) {
       if(err || foundHist === null) {
            req.flash("error", "History question not found!");
            res.redirect("/history");
       } else {
           next();
       }
    });
}
// History question EDIT & DELETE validation/auth
middlewareObj.checkHistoryOwnership = function(req, res, next) {
    // check user log in
    if(req.isAuthenticated()) {
        History.findById(req.params.id, function(err, foundHist) {
            if(err || foundHist === null) {
                req.flash("error", "History question not found!");
                res.redirect("/history");
            } else {
                // check ownership
                if(foundHist.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Access denied!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Log in is required");
        res.redirect("back");
    }
}


// Answer auth/validation
middlewareObj.checkAnswerOwnership = function(req, res, next) {
    // check user log in
    if(req.isAuthenticated()) {
        Answer.findById(req.params.answer_id, function(err, foundAnswer) {
            if(err || foundAnswer === null) {
                res.redirect("back");
            } else {
                // check ownership
                if(foundAnswer.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Access denied!")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Log in is required");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Log in is required");
    res.redirect("/login");   
}



module.exports = middlewareObj;















