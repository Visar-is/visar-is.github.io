module.exports = function (grunt) {


    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Concat opts
        concat: {
            dist: {
                src: [
                    //"vendor/jquery2/jquery.js"
                    "build/js/src/*.js"
                ],
                dest: "build/js/production.js"
            },
            css: {
                src: [
                    "vendor/normalize-css/normalize.css",
                    "vendor/animate.css/animate.css",
                    "build/css/*.css"
                ],
                dest: "build/all.css"
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
                        dest: "build/css",
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
                src: 'build/*.css'
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'build/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/',
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
