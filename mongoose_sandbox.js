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
        type:  {type: String, default: "goldfish"},
        color: {type: String, default: "golden"},
        size:  {type: String, default: "small"},
        mass:  {type: Number, default: .005},
        name:  {type: String, default: "Fisho"}
    })
     const Animal = mongoose.model("Animal", animalSchema);

     let animal = new Animal({}); //creates new Animal based on defaults

     const elephant = new Animal({
        type: "elephant",
        color: "grey",
        size: "large", 
        mass: 6000,
        name: "Lawrence"
     })

     Animal.remove({}, function(){ //removes everything from Animal collection prior to saves starting
        elephant.save(function(err){
            if (err) console.error("Save Failed ", err);
            animal.save(function(err){     //db closes after animal is finished saving
                console.log("Save success")
                db.close(function(){
                    console.log("db connection closed")
                });
            });
        });
     }); 
})