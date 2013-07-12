module.exports = function(grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		'connect': {
			all: {
				options: {
					port: 8000,
				}
			}
		},
		'pkg': grunt.file.readJSON('package.json'),
		'jshint': {
			options: {
				evil: true
			},
			all: ['source/*.js']
		},
		'uglify': {
			 sundaydata : {
				files: {
					"build/sundaydata.min.js": ["build/sundaydata.js"]
				}
			}
		},
		'minifyenyostyle': {
		}
	});
	grunt.registerTask('minifyenyostyle', 'Minify with Enyo',function() {
		grunt.log.writeln('start minify enyo');
		var options = {
			cmd: 'tools/minify.sh',
			fallback: 'Failed to minify with enyo'
		};
		var done = this.async();
		function doneFunction(error, result, code) {
			grunt.log.writeln('doneFunction called');
			if (error) {
				grunt.log.writeln('error ' + String(error));
				grunt.fail(error);
				done();
				return;
			}

			if (result) {
				grunt.log.writeln('result ' + String(result));
				done();
				return;
			}

			// The numeric exit code.
			if (code) {
				grunt.log.error('code ' + code);
				done();
				return;
			}
		}
		grunt.util.spawn(options, doneFunction);
	});
	grunt.registerTask('testcouch', 'Test to Couchdb',function() {
		grunt.log.writeln('start test enyo');
		var options = {
			cmd: 'erica',
			args: ['push', 'http://testcouch:test123@localhost:5984/testcouch'],
			fallback: 'Failed to test'
		};
		var done = this.async();
		function doneFunction(error, result, code) {
			grunt.log.writeln('doneFunction called');
			if (error) {
				grunt.log.writeln('error ' + String(error));
				grunt.fail(error);
				done();
				return;
			}

			if (result) {
				grunt.log.writeln('result ' + String(result));
				done();
				return;
			}

			// The numeric exit code.
			if (code) {
				grunt.log.error('code ' + code);
				done();
				return;
			}
		}
		grunt.util.spawn(options, doneFunction);
	}); 

	grunt.registerTask('testphantom', 'Testing with phantomjs',function() {
		grunt.log.writeln('start testing phantomjs');
		var options = {
			cmd: 'phantomjs',
			args: ['test/sundaydata/phantomjs-test.js'],
			fallback: 'Failed to test with phantomjs'
		};
		var done = this.async();
		function doneFunction(error, result, code) {
			grunt.log.writeln('doneFunction called');
			if (error) {
				grunt.log.writeln('error ' + String(error));
				grunt.fail(error);
				done();
				return;
			}

			if (result) {
				grunt.log.writeln('result ' + String(result));
				if(String(result).match(/SundayData tests passed!/) === null) {
					grunt.log.error("Failed");
				}
				done();
				return;
			}

			// The numeric exit code.
			if (code) {
				grunt.log.error('code ' + code);
				done();
				return;
			}
		}
		grunt.util.spawn(options, doneFunction);
	});

        grunt.registerTask('server', ['connect:all:keepalive']);
        grunt.registerTask('test', ['connect','testphantom']);

	// Default task.
	grunt.registerTask('default', ['jshint', 'minifyenyostyle', 'uglify']);
	grunt.registerTask('couch', ['jshint', 'minifyenyostyle', 'uglify', 'testcouch']);

};
