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
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*\n' +
                    '<%= pkg.name %>\n' +
                    'Version: <%= pkg.version %>\n' +
                    'Date: <%= grunt.template.today("dd-mm-yyyy") %>\n' +
                    '*/'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).

    grunt.registerTask('default', ['concat', 'uglify']);

};