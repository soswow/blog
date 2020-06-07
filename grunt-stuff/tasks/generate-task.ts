/// <reference types="../../typings/metalsmith-plugins" />
import globalGrunt from 'grunt';
import Metalsmith from 'metalsmith';
import _ from 'lodash';
import drafts from 'metalsmith-drafts';
import collections from 'metalsmith-collections';
import pagination from 'metalsmith-pagination';
import debug from 'metalsmith-debug';
import markdown from 'metalsmith-markdown';
import permalinks from 'metalsmith-permalinks';
import layouts from 'metalsmith-layouts';
import inPlace from 'metalsmith-in-place';
import assets from 'metalsmith-assets';
import rename from 'metalsmith-rename';

var tagsPlugin = function tagsPlugin (files: any, metalsmith: any, done: any) {
    var tags: any = {};
    _.each(files, function (file) {
        if (!file.tags) {
            return
        }
        file.tags = file.tags.split(' ');
        file.tags.forEach(function (tag: any) {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(file);
        });
    });
    metalsmith.metadata().tags = tags;
    done();
};

console.log('module is loaded');
export default function(grunt: typeof globalGrunt) {
    console.log('default func ran');
    grunt.registerTask('generate', function () {
        var done = this.async();
        var options = this.options({
            root: '.',
            dist: 'build/blog'
        });
        process.env.DEBUG = 'metalsmith:metadata metalsmith:files metalsmith-layouts';

        Metalsmith(options.root)
            .destination(options.dist)
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
              .use(drafts())
              .use(collections({
                  posts: {
                    sortBy: 'date',
                    reverse: true
                  },
                  pages: {
                    sortBy: 'date',
                    reverse: true
                  }
              }))
              .use(pagination({
                  'collections.posts': {
                      perPage: 10,
                      noPageOne: true,
                      first: 'index.njk',
                      layout: 'index.njk',
                      path: 'page/:num/index.njk'
                  }
              }))
              .use(tagsPlugin)
              .use(debug())
              .use(markdown())
              .use(permalinks({
                pattern: ':title'
              }))
              .use(rename([
                [/\.html$/, ".njk"]
              ]))
              .use(layouts({
                  default: 'post.njk',
                  engine: 'nunjucks',
                  engineOptions: {
                    filters: {
                      date: 'nunjucks-date-filter'
                    }
                  }
              }))
              .use(inPlace({
                  engine: 'nunjucks'
              }))
              .use(rename([
                [/\.njk$/, ".html"]
              ]))

              .use(assets())
            .build(function (err: Error | null) {
                if (err) {
                    console.log(err.stack);
                    throw err;
                }
                done();
            });
    });
};
