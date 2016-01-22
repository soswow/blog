module.exports = {
    watch: {
        build: {
            files: ['Gruntfile.js', 'layouts/**', 'src/**'],
            tasks: ['generate'],
            options: {
                livereload: true
            }
        }
    },
    generate: {
        options: {
            root: '.',
            dist: './build/blog'
        }
    },
    connect: {
        server: {
            options: {
                port: 8080,
                open: '/blog',
                base: 'build'
            }
        }
    },
    'gh-pages': {
        options: {
            base: 'build/blog'
        },
        src: ['**']
    }
};