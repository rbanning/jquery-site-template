/**
 * Created by rbanning on 7/6/2015.
 */
(function(module) {
    'use strict';
    module.exports = function(grunt){

        require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

        var concat_options = {
            separator:
            grunt.util.linefeed + "/** end lib **/" + grunt.util.linefeed,
            banner:
            "/** JS :: "
            + '<%= pkg.name %> - v<%= pkg.version %>'
            + " :: "
            + '<%= grunt.template.today("yyyy-mm-dd") %>'
            + " **/" + grunt.util.linefeed
        };

        //NOTE: 
        var config = {

            pkg: grunt.file.readJSON('package.json'),

            clean: {
                log: '_logs',
                working: '_working',
                cache: '_cache'
            },

            /* JAVASCRIPT */

            jshint: {
                options: {
                    asi: true,
                    browser: true,
                    curly: true,
                    devel: true,		//ok to leave console.log in the code??
                    eqeqeq: true,
                    eqnull: true,
                    latedef: true,
                    laxbreak: true,
                    laxcomma: true,
                    noarg: true,
                    nonbsp: true,
                    strict: true,
                    undef: true,
                    unused: false,
                    globals: {
                        jQuery: true,
                        moment: true,
                        toastr: true,
                        angular: true,
                        gapi: true
                    },
                    reporter: require('jshint-stylish')
                },
                main: {
                    options: {
                        //option overrides
                        reporterOutput: '_logs/jshint-main.txt'
                    },
                    files: {
                        src: ['_dev/main/js/**/*.js']
                    }
                }
            },



            concat: {

                main: {
                    options: concat_options,
                    files: {
                        'assets/js/main.js': ['assets/main/js/**/*.js']
                    }
                },
                vendor: {
                    options: concat_options,
                    files: {
                        'assets/js/vendor.min.js': [
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/moment/min/moment.min.js'
                            ]                         
                    }
                }
            },

            uglify: {
                main: {
                    files: {
                        'assets/js/main.min.js': ['assets/js/main.js']
                    }
                }
            },


            /*  LESS / CSS  */

            less: {
                main: {
                    options: {

                    },
                    files: {
                        "_dev/main/css/compiled.css": "_dev/main/less/master.less"
                    }
                }
            },

            autoprefixer: {
                main: {
                    options: {
                        browsers: ['last 2 versions', '> 1%']
                    },
                    expand: true,
                    flatten: true,
                    files: {
                        '_dev/main/css/prefixed.css': '_dev/main/css/compiled.css'
                    }
                }
            },

            cssc: {
                main: {
                    options: {
                        consolidateViaDeclarations: true,
                        consolidateViaSelectors:    true,
                        consolidateMediaQueries:    true
                    },
                    files: {
                        'assets/css/main.css': '_dev/main/css/prefixed.css'
                    }
                }
            },

            cssmin: {
                main: {
                    src: 'assets/css/main.css',
                    dest: 'assets/css/main.min.css'
                }
            },


            // -- COPY -- //
            copy: {
                vendor: {
                    files: {
                        'assets/js/jquery.min.js.map': 'bower_components/jquery/dist/jquery.min.js.map'
                    }
                }
            },

            watch: {
                main: {
                    files: ['_dev/main/less/*.less', '_dev/main/js/**/*.js', '_dev/main/ideas/**/*.html'],
                    tasks: ['build_main_css', 'build_main_js']
                },
                main_css: {
                    files: ['_dev/main/less/*.less'],
                    tasks: ['build_main_css']
                },
                main_js: {
                    files: ['_dev/main/js/**/*.js'],
                    tasks: ['build_main_js']
                }
            }
        };


        grunt.initConfig(config);

        grunt.registerTask('build_main_css', ['less:main', 'autoprefixer:main', 'cssc:main', 'cssmin:main']);
        grunt.registerTask('build_main_js', ['jshint:main', 'concat:main', 'uglify:main']);

        grunt.registerTask('build_vendor', ['concat:vendor', 'copy:vendor']);

        grunt.registerTask('default', ['build_vendor','build_main_css','build_main_js']);

    };
}(module));
