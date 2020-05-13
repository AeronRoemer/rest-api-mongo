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
    const AnimalSchema = new Schema({
        type:  {type: String, default: "goldfish"},
        color: {type: String, default: "golden"},
        size:  String,
        mass:  {type: Number, default: .005},
        name:  {type: String, default: "Fisho"}
    })
    AnimalSchema.statics.findSmall = function(callback){
        //this = Animal
        return this.find({size: "small"}, callback)
    }
    AnimalSchema.methods.findSameColor = function(callback){
        //this = document
        return this.model("Animal").find({color: this.color}, callback);
    }


    AnimalSchema.pre("save", function(next){//prior to saving, this middleware runs
        if (this.mass >= 100){
            this.size = "big"
        } else if (this.mass >= 5 && this.mass < 100){
            this.size = "medium"
        } else {
            this.size = "small"
        }
        next();
    })
     const Animal = mongoose.model("Animal", AnimalSchema);

     const animal = new Animal({}); //creates new Animal based on defaults

     const elephant = new Animal({
        type: "elephant",
        color: "grey",
        mass: 6000,
        name: "Lawrence"
     })

     const animalData = [
        {
            type: "mouse",
            color: "grey",
            mass: .03,
            name: "Marvin"
         }, {
            type: "nutria",
            color: "brown",
            mass: 6.35,
            name: "Ratty"
         }, {
            type: "coyote",
            color: "brown",
            mass: 25,
            name: "Oglo"
         }, 
         elephant,
         animal
     ]

     Animal.remove({}, async function(err){ //removes everything from Animal collection prior to saves starting
            if (err) console.error("Save Failed ", err);
            //nested callbacks could be cleaned up in real app. Left messy in sandbox
            await Animal.create(animalData, function(err, animals){ 
                if(err) console.error(err);
                console.log("Save success")
                Animal.findSmall(function(err, animals){
                    console.error(err);
                    animals.forEach(element => {
                        console.log(element.name + " is a " + element.type);
                    });
                })
                
                });
            await Animal.findOne({type: "elephant"}, function(err, elephant){
                console.error(err);
                elephant.findSameColor(function(err, animals){
                    animals.forEach(element => {
                        console.log(element.name + " is the same color as " + elephant.name);
                    });
            })
            });
            db.close(function(){ //db closes after animal is finished saving
                console.log("db connection closed")
     }); 
    });
})