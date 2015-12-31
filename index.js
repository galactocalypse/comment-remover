var async = require('async')
,CommentRemover = require('./CommentRemover');

(function main () {
	var pathToRead = [];
	for (var i = 2; i < arguments.length; i++) {
		pathToRead.push(arguments[i]);
	}
	if (!pathToRead.length) pathToRead.push('.');
	var CR = new CommentRemover();
	async.eachSeries(pathToRead, CR.processDir, function (err) {
		console.log('Finished');
		process.exit(0);
	});
}).apply(this, process.argv);
