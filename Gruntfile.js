module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-gettext');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Project Configuration
  grunt.initConfig({
    shell: {
      prod: {
        options: {
          stdout: false,
          stderr: false
        },
        command: 'node ./util/build.js'
      },
      dev: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'node ./util/build.js -d'
      }
    },
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString());
          grunt.log.writeln('Waiting for more changes...');
        },
      },
      readme: {
        files: ['README.md'],
        tasks: ['markdown']
      },
      scripts: {
        files: [
          'js/models/**/*.js'
        ],
        tasks: ['shell:dev']
      },
      css: {
        files: ['css/src/*.css'],
        tasks: ['cssmin:copay']
      },
      main: {
        files: [
          'js/init.js',
          'js/app.js',
          'js/directives.js',
          'js/filters.js',
          'js/routes.js',
          'js/mobile.js',
          'js/services/*.js',
          'js/controllers/*.js'
        ],
        tasks: ['concat:main']
      },
      config: {
        files: ['config.js'],
        tasks: ['shell:dev', 'concat:main']
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
      },
      src: ['test/*.js'],
    },
    markdown: {
      all: {
        files: [{
          expand: true,
          src: 'README.md',
          dest: '.',
          ext: '.html'
        }]
      }
    },
    concat: {
      vendors: {
        src: [
          'lib/mousetrap/mousetrap.min.js',
          'js/shell.js', // shell must be loaded before moment due to the way moment loads in a commonjs env
          'lib/moment/min/moment.min.js',
          'lib/qrcode-generator/js/qrcode.js',
          'lib/underscore/underscore.js',
          'lib/bitcore.js',
          'lib/crypto-js/rollups/sha256.js',
          'lib/crypto-js/rollups/pbkdf2.js',
          'lib/crypto-js/rollups/aes.js',
          'lib/file-saver/FileSaver.js',
          'lib/socket.io-client/socket.io.js',
          'lib/sjcl.js',
          'lib/ios-imagefile-megapixel/megapix-image.js',
          'lib/qrcode-decoder-js/lib/qrcode-decoder.min.js',
          'lib/zeroclipboard/ZeroClipboard.min.js'
        ],
        dest: 'lib/vendors.js'
      },
      angular: {
        src: [
          'lib/angular/angular.min.js',
          'lib/angular-route/angular-route.min.js',
          'lib/angular-moment/angular-moment.js',
          'lib/angular-qrcode/qrcode.js',
          'lib/ng-idle/angular-idle.min.js',
          'lib/angular-foundation/mm-foundation.min.js',
          'lib/angular-foundation/mm-foundation-tpls.min.js',
          'lib/angular-gettext/dist/angular-gettext.min.js'
        ],
        dest: 'lib/angularjs-all.js'
      },
      main: {
        src: [
          'js/app.js',
          'js/directives.js',
          'js/filters.js',
          'js/routes.js',
          'js/services/*.js',
          'js/controllers/*.js',
          'js/translations.js',
          'js/mobile.js', // PLACEHOLDER: CORDOVA SRIPT
          'js/init.js'
        ],
        dest: 'js/copayMain.js'
      }
    },
    cssmin: {
      copay: {
        files: {
          'css/copay.min.css': ['css/src/*.css'],
        }
      },
      vendors: {
        files: {
          'css/vendors.min.css': ['css/foundation.min.css', 'css/foundation-icons.css', 'lib/angular/angular-csp.css']
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      prod: {
        files: {
          'js/copayMain.js': ['js/copayMain.js'],
          'lib/angularjs-all.js': ['lib/angularjs-all.js'],
          'lib/vendors.js': ['lib/vendors.js']
        }
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': ['index.html', 'views/*.html', 'views/**/*.html']
        }
      },
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'copayApp'
        },
        files: {
          'js/translations.js': ['po/*.po']
        }
      },
    },
    jsdoc: {
      dist : {
        src: ['js/models/core/*.js'],
        options: {
          destination: 'doc',
          configure: 'jsdoc.conf.json',
          template: './node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          theme: 'flatly'
        }
      }
    }
  });


  grunt.registerTask('default', ['shell:dev', 'nggettext_compile', 'concat', 'cssmin']);
  grunt.registerTask('prod', ['shell:prod', 'nggettext_compile', 'concat', 'cssmin', 'uglify']);
  grunt.registerTask('translate', ['nggettext_extract']);
  grunt.registerTask('docs', ['jsdoc2md']);
};
