/**
 * HTTP Server Builder
 */
'use strict';

const http = require('http');
const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;

class HttpServer {
    constructor(id, ssl = null) {
        this.id = id;

        this.initialize = (request, response) => {
            const decoder = new StringDecoder('utf-8');
            let buffer = '';
            request.on('data', (data) => {
                buffer += decoder.write(data);
            });
            request.on('end', () => {
                buffer += decoder.end();
                response.end(`Hello!`);
            });
        }

        if (ssl) {
            if (!ssl.key || !ssl.cert) throw 'ERROR: ssl.key or ssl.cert undefined';

            this.server = https.createServer(ssl, this.initialize);
        } else {
            this.server = http.createServer(this.initialize);
        }
    }

    listen(port) {
        if (typeof(port) !== 'number') throw 'ERROR: port is not a number';

        this.server.listen(port, () => {
            console.log(`The ${this.id} server is listening on port ${port}`);
        });
    }
}

class HttpServerBuilder {

    constructor(id) {
        this.id = id;
        this.ssl = null;
    }

    addSSL(key, cert) {
        this.ssl = {
            'key': key,
            'cert': cert
        };
        return this;
    }

    build() {
       return new HttpServer(this.id, this.ssl);       
    }
}

module.exports = {
    'Builder': HttpServerBuilder
};