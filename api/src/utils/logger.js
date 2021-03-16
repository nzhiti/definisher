const winston = require('winston');
require('winston-daily-rotate-file');

const config = require('#app/config');

function createTransport(name, options = {}) {
    return new (winston.transports.DailyRotateFile)(Object.assign({
        filename: `${name}-%DATE%.log`,
        dirname: config.errorPath,
        maxSize: '1m',
        maxFiles: '20',
    }, options));
}

module.exports = new winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        createTransport('error', { level: 'error' }),
        createTransport('info', { level: 'info' }),
        createTransport('combined'),
    ],
});