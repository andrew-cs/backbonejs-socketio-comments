var mongoose = require('mongoose'),	
	CommentsModel = require('../models/comments.js');

// Returns all comments
var getAll = function(req, res) {
	CommentsModel.Comment.find({}, function (err, comments) {
		if (err) {
			console.log('error');
		}
					
		res.type('application/json');
	    res.send(200, comments);
	});
	
};

// Return a single comment
var getOne = function(req, res) {
	CommentsModel.Comment.findById(req.params.id, function (err, comment) {
		if (err) {
			console.log('Error searching the comment...');
		}
	
		res.type('application/json');
		res.send(200, comment);
	});					
};

// Adds a comment
var add = function(req, res, io) {					
  	var comment = new CommentsModel.Comment({
  		text: req.body.text,
  		like: 0,
  		dislike: 0,
  		creationDate: new Date()
  	});

  	comment.save(function (err, comm) {  		
		if (err) {
			res.type('text/plain');
			res.send(500, "Error saving the comment");
		} else {
			res.type('application/json');
			res.send(200, comm);
			
			console.log('broadcasting add');
			io.sockets.emit('/comments:create', comm);
		}
	});			
};

// Updates a single comment
var update = function(req, res, io) {
	CommentsModel.Comment.findById(req.params.id, function (err, comment) {
		if (err) {
			console.log('Error searching the comment...');
		}

		// Update the comment
		comment.like = req.body.like;
		comment.dislike = req.body.dislike;

		// Save the modified comment
		comment.save(function (err, comm) {  		
			if (err) {
				res.type('text/plain');
				res.send(500, "Error saving the comment");
			} else {
				res.type('application/json');
				res.send(200, comm);

				console.log('broadcasting update');
				io.sockets.emit('/comments/' + req.params.id + ':update', comm);
			}
		});				
	});

};

// Deletes a single comment
var del = function(req, res, io) {	
	CommentsModel.Comment.findById(req.params.id, function(err, comment) {
		if (comment) {
			comment.remove(function(err, comm) {
				if (err) {
					res.type('text/plain');
					res.send(500, "Error removing the comment");
				} else {
					res.type('application/json');
					res.send(200, "");

					console.log('broadcasting delete');
					io.sockets.emit('/comments/' + req.params.id + ':delete', comment);
					
				}
			});			
		}
	});	
};

module.exports = {
	getOne: getOne,
	getAll: getAll,
	add: add,
	update: update,
	delete: del
};