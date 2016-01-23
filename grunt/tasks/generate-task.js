'use strict';
var Metalsmith = require('metalsmith');
var pluginsConfig = require('../metalsmth-plugins-config');
var _ = require('lodash');

Metalsmith.prototype.loadPlugins = function (pluginsConfig, pluginsToLoad) {
    pluginsToLoad.forEach(pluginName => {
        if(_.isFunction(pluginName)){
            console.log('custom ' + pluginName.name + ' loaded');
            this.use(pluginName);
        }else {
            console.log('metalsmith-' + pluginName + ' loaded');
            var plugin = require('metalsmith-' + pluginName);
            if (pluginsConfig[pluginName] === true) {
                this.use(plugin());
            } else {
                this.use(plugin(pluginsConfig[pluginName]));
            }
        }
    });
    return this;
};

var tagsPlugin = function tagsPlugin (files, metalsmith, done) {
    var tags = {};
    _.each(files, function (file) {
        if (!file.tags) {
            return
        }
        file.tags = file.tags.split(' ');
        file.tags.forEach(function (tag) {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(file);
        });
    });
    metalsmith.metadata().tags = tags;
    done();
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
                'collections',
                'pagination',
                tagsPlugin,
                'debug',
                'markdown',
                'permalinks',
                'layouts',
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
