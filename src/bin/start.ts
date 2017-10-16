#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as express from 'express';

import { app } from '../app';
import db from '../db';

import { seedDatabase } from '../db/seed';

// tslint:disable
const debug = require('debug')('debug/server');
const http = require('http');
// tslint:enable

/**
 * Get port from environment and store in Express.
 */

let port: any = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

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

function normalizePort(val: any) {
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

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
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
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function connectDB() {
  db.sync({force: true})
  .then(() => {
    debug('Database is Connected');
    seedDatabase();
  })
  .catch((err: Error) => {
    debug('Database Connection Failed');
    debug(err);
  });
}
