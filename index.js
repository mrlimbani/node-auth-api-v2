const mongoose = require('mongoose');
const app = require('./app');
const config = require('./src/config/config');
const logger = require('./src/config/logger');

let server;
mongoose.connect(config.mongoose.url).then(()=>{
    logger.info('connected to mongodb');
    server = app.listen(config.port,()=>{
        logger.info('listening port');
    });
});

const exitHandler = () => {
    if(server){
        server.close(() => {
            console.log('server closed');
            process.exit(1);
        });
    }else{
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException',unexpectedErrorHandler);
process.on('unhandledRejection',unexpectedErrorHandler);

process.on('SIGTERM',() => {
    console.log('SIGTERM recieved');
    if(server){
        server.close();
    }
});