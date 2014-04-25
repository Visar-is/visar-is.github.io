module.exports = function (grunt) {


    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Concat opts
        concat: {
            dist: {
                src: [
                    //"vendor/jquery2/jquery.js"
                    "vendor/jquery/dist/jquery.js",
                    "vendor/papa-parse/jquery.parse.js",

                    "build/js/src/base.js",
                    "build/js/src/components/toggles.js",
                    "build/js/src/components/tabs.js",
                    "build/js/src/components/avatar-preview.js",
                    "build/js/src/components/csv-preview.js",
                    "build/js/src/pages/messages.js",
                    "build/js/src/pages/contacts.js"
                ],
                dest: "build/js/production.js"
            },
            css: {
                src: [
                    "vendor/normalize-css/normalize.css",
                    "vendor/animate.css/animate.css",
                    "build/css/src/base.css",
                    "build/css/src/common.css",
                    "build/css/src/typography.css",
                    "build/css/src/icons.css",
                    
                    "build/css/src/messages.css",
                    "build/css/src/forms.css",
                    "build/css/src/contacts.css",
                    "build/css/src/tabs.css"
                ],
                dest: "build/css/min/all.css"
            }
        },

        // Uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> */'
            },
            build: {
                src: "build/js/production.js",
                dest: "build/js/production.min.js"    
            }
        },

        // Watch
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ["assets/js/**/*.js"],
                tasks: ["copy", "concat", "uglify"],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ["assets/scss/*.scss"],
                tasks: ["sass","autoprefixer","concat"],
                options: {
                    spawn: false
                }
            }
        },

        // SASS
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [
                    {
                        expand: true,
                        cwd: "assets/scss/",
                        src: ["*.scss"],
                        dest: "build/css/src/",
                        ext: ".css"
                    }
                ]
            }
        },

        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: ['ff 3', 'android 3','last 3 version'],
                diff: 'build/autoprefixer.diff'
            },
            dist: {
                src: 'build/css/min/*.css'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/css/min/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/css/',
                ext: '.min.css'
            }
        },

        copy: {
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/img/',
                        src: ['**'],
                        dest: 'build/img/'
                    },
                ]
            },
            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/js/',
                        src: ['**'],
                        dest: 'build/js/src/'
                    },
                ],
            },
            vendors: {
                files: [
                    {
                        expand: true,
                        cwd: 'vendor/',
                        src: ['**'],
                        dest: 'build/vendor/'
                    },
                ],
            },
            icons: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/icons/',
                        src: ['**'],
                        dest: 'build/icons/'
                    },
                ],
            },
            "css-mq": {
                files: [{
                        expand: true,
                        cwd: 'build/css/src/',
                        src: ['**'],
                        dest: 'build/css/min/'
                }]
            }

        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Specify available cmds/tasks
    grunt.registerTask('dev', ['copy', 'sass', 'concat', 'autoprefixer' ]);
    grunt.registerTask('default', ['copy', 'sass', 'concat', 'autoprefixer', 'cssmin', 'uglify']);

};
