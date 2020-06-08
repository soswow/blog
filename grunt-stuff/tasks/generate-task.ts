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
import images from 'metalsmith-project-images';
import { myConvertPlugin } from './convertPlugin';
import { tagsPlugin } from './tagsPlugin';

export default function(grunt: typeof globalGrunt) {
    grunt.registerTask('generate', function () {
        const done = this.async();
        const options = this.options({
            root: '.',
            dist: 'build/blog'
        });

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
              .use(images({
                pattern: 'public/images/**'
              }))
              .use(myConvertPlugin)
              // .use(debug({
              //   log: "first debusg"
              // }))
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
              .use(rename([
                [/\.md$/, ".md.njk"]
              ]))
              .use(inPlace({
                  engine: 'nunjucks'
              }))
              .use(rename([
                [/\.md\.njk$/, ".md"]
              ]))
              .use(markdown())
              .use(permalinks({
                pattern: ':title',
                relative: false // Will not copy /images into each folder
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
