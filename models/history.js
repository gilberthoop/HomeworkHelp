var mongoose = require("mongoose");

// setup Schema
var historySchema = new mongoose.Schema({
    title: String,
    question: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ],
    create: { type:Date, default: Date.now}
});


module.exports = mongoose.model("History", historySchema);