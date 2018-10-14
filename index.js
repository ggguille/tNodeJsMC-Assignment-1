/**
 * Homework Assignment #1
 * Main file
 */
'use strict';

// Dependencies
const fs = require('fs');
const config = require('./lib/config');
const HttpServer = require('./lib/server/httpServer');
const HandlerManager = require('./lib/server/httpRequestHandler').HandlerManager;
const HelloHandler = require('./lib/handlers/helloHandler');

// Instantiate HTTP request handler manager
const handlerManager = new HandlerManager();
// Add /hello request handler
handlerManager.addHandler(new HelloHandler());

// Instantiate HTTP server
const httpServer = new HttpServer.Builder('http')
    .setHandlerManager(handlerManager)
    .build();
// Start HTTP server
httpServer.listen(config.httpPort);

// Get SSL certification
const sslKey = fs.readFileSync('./ssl/key.pem');
const sslCert = fs.readFileSync('./ssl/cert.pem');
const httpsServer = new HttpServer.Builder('https')
    .addSSL(sslKey, sslCert)
    .setHandlerManager(handlerManager)
    .build();
// Start HTTPS server
httpsServer.listen(config.httpsPort);