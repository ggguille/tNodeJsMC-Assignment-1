/**
 * HTTP Server Builder
 */
'use strict';

// Dependencies
const http = require('http');
const https = require('https');
const HandlerManager = require('./httpRequestHandler').HandlerManager;

class HttpServer {
    constructor(id, handlerManager, ssl = null) {
        this.id = id;
        this.handlerManager = handlerManager;

        if (!HandlerManager.validate(this.handlerManager)) 
            throw 'ERROR: not type of HandleManager';

        this.requestListener = (request, response) => {
            this.handlerManager.handle(request, response);
        };

        if (ssl) {
            if (!ssl.key || !ssl.cert) 
                throw 'ERROR: ssl.key or ssl.cert undefined';

            this.server = https.createServer(ssl, this.requestListener);
        } else {
            this.server = http.createServer(this.requestListener);
        }
    }

    listen(port) {
        if (typeof(port) !== 'number') 
            throw 'ERROR: port is not a number';

        this.server.listen(port, () => {
            console.log(`The ${this.id} server is listening on port ${port}`);
        });
    }
}

class HttpServerBuilder {

    constructor(id, handlerManager = null) {
        this.id = id;
        this.ssl = null;
        this.handlerManager = 
            handlerManager !== null ? handlerManager : new HandlerManager();
    }

    addSSL(key, cert) {
        this.ssl = {
            'key': key,
            'cert': cert
        };
        return this;
    }

    setHandlerManager(handlerManager) {
        if (HandlerManager.validate(handlerManager)) {
            this.handlerManager = handlerManager;
        } else {
            throw 'ERROR: not type of HandleManager';
        }
        return this;
    }

    build() {
       return new HttpServer(this.id, this.handlerManager, this.ssl);       
    }
}

module.exports = {
    'Builder': HttpServerBuilder
};