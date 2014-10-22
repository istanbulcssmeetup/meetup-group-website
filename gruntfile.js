module.exports = function(grunt) {
  var _serve            = grunt.option('serve') || false;
  var _devTasks         = ['sprite', 'sass:dev', 'includes', 'copy', 'concurrent'];
  var _concurrentTasks  = ['watch']
  var _watcherTasks     = {
    htmls               : ['includes'],
    sprites             : ['sprite'],
    styles              : ['sass:dev'],
    images              : ['copy:images']
  }
  var _publishTasks     = ['sprite', 'sass:dev', 'includes', 'copy', 'gh-pages']

  if(_serve){ _concurrentTasks.push('connect') }

  grunt.initConfig({
    pkg             : grunt.file.readJSON('package.json'),

    concurrent      : {
      target        : {
        tasks       : _concurrentTasks,
        options     : {
          logConcurrentOutput : true
        }
      }
    },

    copy            : {
      images        : {
        expand      : true,
        cwd         : './src/images',
        src         : ['**/*', '!**/sprite/**'],
        dest        : './dist/images/'
      },
      vendor        : {
        expand      : true,
        cwd         : './src/vendor',
        src         : ['**/*'],
        dest        : './dist/vendor/'
      },
      cname         : {
        files       : [{
          expand    : true,
          cwd       : './src',
          src       : 'CNAME',
          dest      : './dist/'
        }]
      }
    },

    connect         : {
      server        : {
        options     : {
          port      : 1992,
          base      : './dist',
          keepalive : true
        }
      }
    },

    sass            : {
      dev           : {
        options     : {
          sourcemap : 'auto',
          trace     : true,
          style     : 'expanded',
          update    : true,
          compass   : true
        },
        files       : {
          './dist/style.css' : './src/styles/main.sass'
        }
      }
    },

    sprite          : {
      all           : {
        src         : ['./src/images/sprite/*.png'],
        destImg     : './dist/images/sprite.png',
        destCSS     : './src/styles/sprite.sass',
        imgPath     : './images/sprite.png',
        cssFormat   : 'sass',
        padding     : 10
      }
    },

    includes        : {
      files         : {
        src         : ['src/htmls/*.html'],
        dest        : 'dist',
        flatten     : true,
        cwd         : '.',
        options     : {
          silent    : false
        }
      }
    },

    'gh-pages'      : {
      options       : {
        base        : 'dist'
      },
      src           : ['**']
    },

    watch           : {
      htmls         : {
        files       : ['./src/htmls/**/*.html'],
        tasks       : _watcherTasks.htmls
      },
      sprites       : {
        files       : ['./src/images/sprites/*.png'],
        tasks       : _watcherTasks.sprites
      },
      images        : {
        files       : ['./src/images/**/*', '!./src/images/sprite/*'],
        tasks       : _watcherTasks.images
      },
      styles        : {
        files       : ['./src/styles/main.sass'],
        tasks       : _watcherTasks.styles
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('dev',   _devTasks);
  grunt.registerTask('publish',  _publishTasks);

}
