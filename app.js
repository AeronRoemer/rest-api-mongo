'use strict';

const express = require("express");
const app = express();
const routes = require("./routes");

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

app.use("/questions", routes);

// if request falls through all routes above, 
// this middleware will catch 404 and forward to error handler
//'next' required to continue to next middleware
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler

app.use(function(err, req, res, next){
	//500 comes from internal server errors
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3000;
//callback function executes after 'listen'
app.listen(port, function(){
	console.log("Express server is listening on port", port);
});















