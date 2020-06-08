import Metalsmith from 'metalsmith';
import _ from 'lodash';

export const tagsPlugin: Metalsmith.Plugin = function tagsPlugin (files, metalsmith, done) {
  const tags: {[key: string]: any[]} = {};
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
  const metadata = metalsmith.metadata();
  metalsmith.metadata({
    ...metadata,
    tags
  });
  done(null, files, metalsmith);
};
