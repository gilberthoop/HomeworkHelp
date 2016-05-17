var mongoose = require("mongoose");
var Math = require("./models/math");
var Answer = require("./models/answer");


var data = [
        {
            title: "Algebra",
            question: "What is x in 5+5 = x?"
        } 
    ];
    

function seedDb() {
    // remove all players
    Math.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("REMOVED MAths");
        //add a few players
        data.forEach(function(seed){
            Math.create(seed, function(err, math) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a question");
                    //create an answer
                    Answer.create(
                        {
                            text: "10",
                            author: "gilberthoop"
                        }, function(err, answer) {
                            if(err){
                                console.log(err);
                            } else {
                                math.answers.push(answer);
                                math.save();
                                console.log("new answer created");
                            } 
                        }); 
                }
            });
        });
    });
}

module.exports = seedDb;