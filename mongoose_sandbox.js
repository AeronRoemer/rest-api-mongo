'use strict'
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection;
db.on("error", function(err){
    console.error("connection error:", err)
})
//only fires event the first time it occurs
db.once("open", function(){
    console.log("Database connection successfull")
    const Schema = mongoose.Schema;
    const animalSchema = new Schema({
        type: String,
        color: String,
        size: String, 
        mass: Number,
        name: String
    })
     const Animal = mongoose.model("Animal", animalSchema)
     const elephant = new Animal({
        type: "elephant",
        color: "grey",
        size: "large", 
        mass: 6000,
        name: "Lawrence"
     })
     elephant.save(function(err){
         if (err){
             console.error("Save Failed ", err)
         } else {
             console.log("Save success")
             db.close(function(){
                 console.log("db connection closed")
             });
         }
     });
    
})