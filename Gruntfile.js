module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: '8000',
          keepalive: true,
          base: {
            path: '.',
            options: {
              index: 'index.html'
            }
          }
        }
      }
    },
    plato: {
      dev: {
        options: {
          exclude: /\.min.js$/
        },
        files: {
          'reports': ['src/*.js']
        }
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-plato');

  grunt.registerTask('default', ['']);

};
