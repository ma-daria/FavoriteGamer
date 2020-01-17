module.exports = {
    apps: [{
        name: 'wnm',
        script: './bin/www.js',
        exec_mode: 'fork',
        instances: 1,
    }]
};