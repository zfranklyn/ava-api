#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var db_1 = require("../db");
var seed_1 = require("../db/seed");
// tslint:disable
var debug = require('debug')('debug/server');
var http = require('http');
// tslint:enable
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '8080');
app_1.app.set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app_1.app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('listening', connectDB);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
function connectDB() {
    db_1.default.sync({ force: true })
        .then(function () {
        debug('Database is Connected');
        seed_1.seedDatabase();
    })
        .catch(function (err) {
        debug('Database Connection Failed');
        debug(err);
    });
}
