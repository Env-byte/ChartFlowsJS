let sass = require('sass');

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: '\n'
            },
            js: {
                // the files to concatenate
                src: [
                    '<%= pkg.directories.src %>/js/typeDefinitions.js',
                    '<%= pkg.directories.src %>/js/config.js',
                    '<%= pkg.directories.src %>/js/api.js',
                    '<%= pkg.directories.src %>/js/main.js',
                    '<%= pkg.directories.src %>/js/utils/*.js',
                    '<%= pkg.directories.src %>/js/core/*.js',
                    '<%= pkg.directories.src %>/js/blocks/*.js',
                    '<%= pkg.directories.src %>/js/symbols/*.js'
                ],
                // the location of the resulting JS file
                dest: '<%= pkg.directories.dist %>/<%= pkg.name %>.js'
            },
        },
        'closure-compiler': {
            frontend: {
                closurePath: 'node_modules/google-closure-compiler-java/',
                js: '<%= concat.js.dest %>',
                jsOutputFile: '<%= pkg.directories.dist %>/<%= pkg.name %>.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                }
            }
        },
        sass: {
            dist: {
                options: {
                    implementation: sass,
                },
                files: {
                    '<%= pkg.directories.dist %>/<%= pkg.name %>.css': '<%= pkg.directories.src %>/sass/style.scss'
                }
            },
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    '<%= pkg.directories.dist %>/<%= pkg.name %>.min.css': '<%= pkg.directories.dist %>/<%= pkg.name %>.css'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'closure-compiler', 'sass', 'cssmin']);

};