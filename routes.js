'use strict';

const express = require("express");
const router = express.Router();
const Question = require("./models").Question

router.param(//calls method on any matching route
	"qID", //name of route as a string
	function(req, res, next, id){ //executed when qID is present in route
		Question.findById(id, function(err, document){
			if (err) return next(err);
			if (!document){
				err = new Error("Not Found");
				err.status = 404;
				return next(err);
			}
			req.question(document)
			return next(); //goes on to next middleware
		})
	}
); 
 
router.param(//to match answer documents
	"aID", 
	function(req, res, next, id){ //executed when aID is present in route
		req.answer = req.question.answers.id(id)// 'id' is a mongoose method that returns a document with matching ID
		if (!req.answer){
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
			}
			return next();
	}
); 
// GET /questions
// Route for questions collection
router.get("/", function(req, res, next){
	Question.find({}, null, {sort:{createdAt: -1}}, //object literal provides sort params. -1 for desc order
		 function(err, questions){ //second method is projection
			if (err) return next(err);
			res.json(questions); //returns questions as json response
	})
});
/* MONGOOSE QUERY BUILDER
can also be made like this: 
Question.find({})
	.sort({createdAt: -1})
	.exec(
		function(err, questions){
			if (err) return next(err);
			res.json(questions); 
	)
allows for more options between querying and executing the query
*/

// POST /questions
// Route for creating questions
router.post("/", function(req, res){
	const question = new Question(req.body);
	question.save(function(err, next){ //on saving
		if (err) return next(err);
		res.status(201); //for successful creation
		res.json(question);//sends json of new question
	});
});

// GET /questions/:id
// Route for specific questions
router.get("/:qID", function(req, res){
	res.json(req.question);
});

// POST /questions/:id/answers
// Route for creating an answer
router.post("/:qID/answers", function(req, res, next){
	req.question.answers.push(req.body)
	req.question.save(function(err, next){
		if (err) return next(err);
		res.status(201); //for successful creation
		res.json(question);//sends json of new question
	})
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res){
	req.answer.update(req.body, function(err, update){
		if (err) return next(err);
		res.status(201);
		res.json(update);
	}) //relying on route middleware
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res){
	req.answer.remove(function(err){
		req.question.save(function(err){
			if (err) return next(err);
			res.json(question) //returns question, now missing deleted answer
		})
	})//mongoose remove method
});

// POST /questions/:qID/answers/:aID/vote-up & vote-down
// passed a function to display 404 if url doesn't contain 'up' or 'down'
// Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
	//.search() returns -1  when no match is found
		if(req.params.dir.search(/^(up|down)$/) === -1) {
			var err = new Error("Not Found");
			err.status = 404;
			next(err);
			//err gets passed to a function that can handle it
		} else {
			req.vote = req.params.dir; //name change for readability 
			next();
		}
	}, function(req, res){
		req.answer.vote(req.vote, function(err, question){
			if (err) return next(err);
			res.json(question);
		})
});

module.exports = router;
















