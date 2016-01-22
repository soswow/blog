'use strict';
var Metalsmith = require('metalsmith');
var pluginsConfig = require('../metalsmth-plugins-config');

Metalsmith.prototype.loadPlugins = function (pluginsConfig) {
    for (var pluginName in pluginsConfig) {
        var plugin = require('metalsmith-' + pluginName);
        if (pluginsConfig[pluginName] === true) {
            this.use(plugin());
        } else {
            this.use(plugin(pluginsConfig[pluginName]));
        }
    }
    return this;
};

module.exports = function(grunt) {

    grunt.registerTask('generate', function () {
        var done = this.async();
        var options = this.options({
            root: '.',
            dist: 'build/blog'
        });

        Metalsmith(options.root)
            .destination('build/blog')
            .metadata({
                site: {
                    title: 'Blog #42',
                    baseurl: '/blog',
                    tagline: 'Notes to future me'
                }
            })
            .loadPlugins(pluginsConfig)
            //.use(function (files, metalsmith, cb) {
            //    console.log(Object.keys(files));
            //    console.log(files['page/2/index.html'].pagination);
            //    cb()
            //})
            .build(function (err) {
                if (err) {
                    console.log(err.stack);
                    throw err;
                }
                done();
            });
    });
};
