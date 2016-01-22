module.exports = {
    collections: {
        posts: {
            sortBy: 'date',
            reverse: true
        }
    },
    pagination: {
        'collections.posts': {
            perPage: 2,
            noPageOne: true,
            first: 'index.html',
            layout: 'index.html',
            path: 'page/:num/index.html'
        }
    },
    markdown: true,
    permalinks: {
        pattern: ':title'
    },
    layouts: {
        default: 'post',
        directory: 'layouts',
        engine: 'nunjucks'
    },
    'in-place': {
        engine: 'nunjucks'
    },
    assets: true
};