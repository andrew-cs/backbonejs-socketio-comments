var mongoose = require('mongoose');  

mongoose.connect('mongodb://admin:Admin1234@localhost/backbone-comments');	

// Comments collection
var CommentSchema = new mongoose.Schema({
	text     		: String,
	like      		: Number,
	dislike      	: Number,
	creationDate    : Date
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
	Comment: Comment
};
