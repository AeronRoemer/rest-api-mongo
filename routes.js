'use strict';

const express = require("express");
const router = express.Router();
const Question = require("./models").Question

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
	question.save(function(err, next){
		if (err) return next(err);
		res.status(201); //for successful creation
		res.json(question);//sends json of new question
	});
});

// GET /questions/:id
// Route for specific questions
router.get("/:qID", function(req, res){
	Question.findById(req.params.qID, function(err, document){
		if (err) return next(err);
		res.json(document); //returns questions as json response
	})
});

// POST /questions/:id/answers
// Route for creating an answer
router.post("/:qID/answers", function(req, res){
	res.json({
		response: "You sent me a POST request to /answers",
		questionId: req.params.qID,
		body: req.body
	});
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res){
	res.json({
		response: "You sent me a PUT request to /answers",
		questionId: req.params.qID,
		answerId: req.params.aID,
		body: req.body
	});
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res){
	res.json({
		response: "You sent me a DELETE request to /answers",
		questionId: req.params.qID,
		answerId: req.params.aID
	});
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
			next();
		}
	}, function(req, res){
	res.json({
		response: "You sent me a POST request to /vote-" + req.params.dir,
		questionId: req.params.qID,
		answerId: req.params.aID,
		vote: req.params.dir
	});
});

module.exports = router;
















