
module.exports = function(grunt) {

  var port = 2121;

  grunt.initConfig({
    'http-server':{
      dev:{
        root:'.',
        port:port,
        host:'0.0.0.0',
        runInBackground:true
      }
    },
    compass:{
      dev:{
        options:{
          cssPath:'test/css',
          sassPath:'test/sass',
          noLineComments:true
        }
      }
    },
    pug: {
      compile: {
        options: {
          pretty:true,
          data: {
            debug: false
          }
        },
        files: {
          'test/index.html': ['test/pug/base.pug'],
          'test/base.html': ['test/pug/base.pug'],
          'production/index.html': ['test/pug/base-production.pug']
        }
      }
    },
    watch:{
      sass:{
        files:'test/sass/**/*.scss',
        tasks:['compass']
      },
      pug:{
        files:'test/pug/**/*.pug',
        tasks:['pug']
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          'dist/css/bp3d.prod.min.css': ['test/css/bp3d.prod.css']
        }
      }
    },
    concat:{
      dist:{
        src:['test/css/app.css', 'test/css/bp3d.css', 'test/css/site.css', 'test/css/site-fullwidth.css'],
        dest:'test/css/bp3d.prod.css'
      },
    },
    clean:{
      dist:['dist/*.js', 'dist/*.css', 'dist/css/*.css'],
      production:['production/assets', 'production/css', 'production/js/*.js']
    },
    copy:{
      'dist-css':{
        expand:true,
        cwd:'test/css',
        src:['*.png', 'fonts/**', 'bp3d-iframe.css'],
        dest:'dist/css/'
      },
      'dist-js':{
        expand:true,
        cwd:'test/js',
        src:['anime.min.js', 'three.min.js'],
        dest:'dist'
      },
      'production-js':{
        expand:true,
        cwd:'dist',
        src:['*.js'],
        dest:'production/js/'
      },
      'production-css':{
        expand:true,
        cwd:'dist',
        src:['css/**'],
        dest:'production/'
      },
      'production-assets':{
        expand:true,
        cwd:'test',
        src:['assets/**', 'config.json', 'data/**'],
        dest:'production/'
      }
    },
    'requirejs':{
      compile:{
        options:{
          baseUrl: "src/",
          paths: {
            'libs': "../libs"
          },
          wrap:{
            startFile:'libs/start.frag',
            endFile:'libs/end.frag'
          },
          //optimize:'none', 
          optimize:'uglify', 
          name:'libs/almond',
          include:['rs/bp3d/BlockPuzzle'],
          out:'dist/bp3d.min.js'
        }
      }
    },
    compress: {
      dist: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: 'dist/',
        src: ['bp3d.min.js'],
        dest: 'dist/',
        ext:'.min.gz.js'
      }
    },
    jshint:{
      check:{
        src:'src/rs/**'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mkdir');

  // Generate distribution files
  grunt.registerTask('dist', 'Create distributions', 
    ['clean:dist', 
    'compass:dev', 
    'concat:dist', 
    'cssmin:dist', 
    'copy:dist-css', 
    'copy:dist-js', 
    'requirejs',
    'compress:dist']);

  // Generate production templates
  grunt.registerTask('production', 'Create production', 
    ['clean:production', 
    'dist', 
    'pug', 
    'copy:production-css', 
    'copy:production-js', 
    'copy:production-assets']);

  grunt.registerTask('default', ['http-server', 'watch']);

}
