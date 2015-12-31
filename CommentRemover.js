var fs = require('fs')
,path = require('path')
,readline = require('readline')
,async = require('async');

function CommentRemover (){
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false
	});

	function getJsFiles (pathToRead, cb) {
		fs.readdir(pathToRead, function (err, listing) {
			cb(err, listing.filter(function(file){
				return file.match(/.js$/i);
			}));
		});
	}

	function processFile (file, cb) {
		console.log('Processing: ' + path.basename(file));
		fs.readFile(file, function(err, data){
			if (err) return cb(err);
			data = data.toString();
			var comment = data.match(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//);
			if (comment) comment = comment[0];
			if (comment) {
				rl.resume();
				rl.question(comment + '\nEnter \'Y\' to remove: ', function (response) {
					rl.pause();
					if (response === 'Y' || response === 'y') {
						data = data.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//, '');
						fs.writeFile(file, data, function (err) {
							console.log('Updated file: ' + path.basename(file));
							return cb();
						});
					}
					else {
						console.log('Ignored file: ' + path.basename(file));
						return cb();
					}
				});
			}
			else {
				console.log('No starting comments in file: ' + path.basename(file));
				return cb();
			}
		});
	}

	function processDir (dir, cb) {
		getJsFiles(dir, function (err, listing) {
			async.eachSeries(listing, function (file, callback) {
				processFile(path.resolve(dir, file), callback);
			}, cb);
		});
	}

	return {
		processDir: processDir
	};

};
module.exports = CommentRemover;
