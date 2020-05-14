'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sortAnswers = function(a, b){
    //for pre-save on question Schema
    if (a.votes === b.votes){ //JS dates are stores as milliseconds
        return b.updatedAt -a.updatedAt;
    }
    return b.votes - a.votes;
}

const AnswerSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default: 0}
});

AnswerSchema.methods.update = function(updates, callback){

};

const questionSchema = new Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    answers: [AnswerSchema]
});

questionSchema.pre("save", function(next){
    this.answers.sort(sortAnswers);
    next();
})
const Question = mongoose.model("Question", questionSchema);

module.exports.Question = Question;