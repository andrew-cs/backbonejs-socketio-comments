var express = require('express'),
	path = require('path'),
	comments = require('./controllers/comments');

var app = express();

// Set server port
app.set('port', process.env.PORT || 3000);  
// Set folder to serve static files
app.use('/', express.static(path.join(__dirname, 'public')));
// Log routes
app.use(express.logger());
app.use(express.bodyParser());

// REST API routes definition
// GET to /comments returns all comments
app.get('/comments', comments.getAll);
// GET to /comments/:id returns a single comment
app.get('/comments/:id', comments.getOne);
// POST to /comments adds a comment
app.post('/comments', function(req, res) {
	comments.add(req, res, io);
});
// PUT to /comments/:id modifies an existing comment
app.put('/comments/:id', function(req, res) {
	comments.update(req,res, io);
});
// DELETE to /comments/:id deletes an existing comment
app.delete('/comments/:id', function(req, res) {
	comments.delete(req,res,io);
});

// Socket.io
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

/**
 * our socket transport events
 *
 * socket.broadcast.emit sends the changes to
 * all other browser sessions. this keeps all
 * of the pages in mirror. our client-side model
 * and collection ioBinds will pick up these events
 */

io.sockets.on('connection', function (socket) {
	console.log('ioBind connection');
});

server.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
});
