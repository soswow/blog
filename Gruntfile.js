var nunjucks = require('nunjucks');
var cons = require('consolidate');
var moment = require('moment');
var gruntTasksConfig = require('./grunt/grunt-tasks-config');

cons.requires.nunjucks = nunjucks.configure('layouts', {dev: false});

cons.requires.nunjucks.addFilter('date', function (date, format) {
    return moment(date).format(format);
});

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadTasks('./grunt/tasks');

    grunt.initConfig(gruntTasksConfig);

    grunt.registerTask('default', ['generate', 'connect', 'watch']);
    grunt.registerTask('deploy', ['generate', 'gh-pages']);
};
