/**
 * Homework Assignment #1
 * Main file
 */
'use strict';

// Dependencies
const fs = require('fs');
const HttpServer = require('./lib/httpServer');

// Instantiate HTTP server
const httpServer = new HttpServer.Builder('http').build();
// Start HTTP server
httpServer.listen(3000);

// Get SSL certification
const sslKey = fs.readFileSync('./ssl/key.pem');
const sslCert = fs.readFileSync('./ssl/cert.pem');
const httpsServer = new HttpServer.Builder('https')
    .addSSL(sslKey, sslCert)
    .build();
// Start HTTPS server
httpsServer.listen(3001);