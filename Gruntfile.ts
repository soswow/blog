import globalGrunt from 'grunt';
import gruntTasksConfig from './grunt-stuff/grunt-tasks-config';
import registerGenerateTask from './grunt-stuff/tasks/generate-task';

module.exports = function(grunt: typeof globalGrunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    registerGenerateTask(grunt);

    grunt.initConfig(gruntTasksConfig);

    grunt.registerTask('default', ['generate', 'connect', 'watch']);
    grunt.registerTask('deploy', ['generate', 'gh-pages']);
};
