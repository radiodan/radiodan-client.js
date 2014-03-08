module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'public/client.js': ['static/client.js']
    },
    uglify : {
      js: {
        files: {
          'public/client.min.js' : [ 'public/client.js' ]
        }
      }
    },
    watch: {
      files: [ "static/**/*.js*"],
      tasks: [ 'default' ]
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [ 'browserify', 'uglify:js' ]);
}
