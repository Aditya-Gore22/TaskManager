// const winston = require('winston');
// const path = require('path');

// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json(),
//     winston.format.prettyPrint()
//   ),
//   transports: [
//     new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
//     new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') })
//   ],
//   exceptionHandlers: [
//     new winston.transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
//   ]
// });

// module.exports=logger;



const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    // all logs
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
    // only error-level logs
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    // still log to console during development
    new transports.Console(),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') }),
  ],
});

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
};


