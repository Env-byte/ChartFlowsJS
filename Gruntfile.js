module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: '\n'
            },
            dist: {
                // the files to concatenate
                src: [
                    'src/js/core/api.js',
                    'src/js/core/config.js',
                    'src/js/blocks/*.js',
                    'src/js/symbols/*.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        'closure-compiler': {
            frontend: {
                closurePath: 'node_modules/google-closure-compiler-java/',
                js: '<%= concat.dist.dest %>',
                jsOutputFile: 'dist/js/<%= pkg.name %>.min.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-closure-compiler');

    // Default task(s).

    grunt.registerTask('default', ['concat', 'closure-compiler']);

};