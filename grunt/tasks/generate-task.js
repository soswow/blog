'use strict';
var Metalsmith = require('metalsmith');
var pluginsConfig = require('../metalsmth-plugins-config');

Metalsmith.prototype.loadPlugins = function (pluginsConfig, pluginsToLoad) {
    pluginsToLoad.forEach(pluginName => {
        console.log('metalsmith-' + pluginName + ' loaded');
        var plugin = require('metalsmith-' + pluginName);
        if (pluginsConfig[pluginName] === true) {
            this.use(plugin());
        } else {
            this.use(plugin(pluginsConfig[pluginName]));
        }
    });
    return this;
};

module.exports = function(grunt) {

    grunt.registerTask('generate', function () {
        var done = this.async();
        var options = this.options({
            root: '.',
            dist: 'build/blog'
        });
        process.env.DEBUG = 'metalsmith:metadata metalsmith:files';

        Metalsmith(options.root)
            .destination('build/blog')
            .metadata({
                site: {
                    github: 'https://github.com/soswow/blog',
                    time: new Date(),
                    title: 'Blog #42',
                    baseurl: '/blog',
                    description: 'I am still not sure if this gonna fly or what I end up putting here',
                    tagline: 'Notes to future me'
                }
            })
            .loadPlugins(pluginsConfig, [
                //'debug',
                'collections',
                //'debug',
                'pagination',
                //'debug',
                'markdown',
                'permalinks',
                'layouts',
                'debug',
                'in-place',
                'assets'
            ])
            .build(function (err) {
                if (err) {
                    console.log(err.stack);
                    throw err;
                }
                done();
            });
    });
};
