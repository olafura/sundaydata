module.exports = function(grunt) {

  grunt.initConfig({
    'jshint': {
      options: {
        evil: true
      },
      all: ['source/*.js']
    },
    'uglify': {
         "build/sundaydata.min.js": ["build/sundaydata.js"]
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
        grunt.log.writeln('code ' + code);
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
        grunt.log.writeln('code ' + code);
        done();
        return;
      }
    }
    grunt.util.spawn(options, doneFunction);
  }); 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
 
  // Default task.
  grunt.registerTask('default', ['jshint', 'minifyenyostyle', 'uglify']);
  grunt.registerTask('couch', ['jshint', 'minifyenyostyle', 'uglify', 'testcouch']);

};
