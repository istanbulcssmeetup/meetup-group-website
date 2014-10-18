module.exports = function(grunt) {
  var _scripts          = require('./src/scripts/includes.js');
  var _serve            = grunt.option('serve') || false;
  var _devTasks         = ['sprite', 'sass:dev', 'concat', 'includes', 'copy', 'concurrent'];
  var _concurrentTasks  = ['watch']
  var _watcherTasks     = {
    htmls               : ['includes'],
    sprites             : ['sprite'],
    scripts             : ['refreshScriptIncludes', 'concat'],
    styles              : ['sass:dev'],
    images              : ['copy:images']
  }

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

    concat          : {
      options       : {
        seperator   : ';',
        sourceMap   : true
      },
      scripts       : {
        src         : _scripts,
        dest        : './dist/script.js'
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
      scripts       : {
        files       : _scripts,
        tasks       : _watcherTasks.scripts
      },
      styles        : {
        files       : ['./src/styles/main.sass'],
        tasks       : _watcherTasks.styles
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('dev',   _devTasks);
  grunt.registerTask('dist',  []);
  grunt.registerTask('clear', []);

  grunt.registerTask('refreshScriptIncludes', '', function(){
    console.log("Refreshing script includes...");
    _scripts        = require('./src/scripts/includes.js');
  });
}
