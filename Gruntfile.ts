import globalGrunt from 'grunt';
import nunjucks from 'nunjucks';
import cons from 'consolidate';
import moment from 'moment';
import gruntTasksConfig from './grunt-stuff/grunt-tasks-config';

cons.requires.nunjucks = nunjucks.configure('layouts');

cons.requires.nunjucks.addFilter('date', function (date: Date, format: string) {
    return moment(date).format(format);
});

module.exports = function(grunt: typeof globalGrunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadTasks('./build/tasks');

    grunt.initConfig(gruntTasksConfig);

    grunt.registerTask('default', ['generate', 'connect', 'watch']);
    grunt.registerTask('deploy', ['generate', 'gh-pages']);
};
