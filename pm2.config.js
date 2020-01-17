module.exports = {
    apps: [{
        name: 'wnm',
        script: './bin/www',
        exec_mode: 'fork',
        instances: 1,
    }]
};