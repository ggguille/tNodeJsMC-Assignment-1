/**
 * Class to handle http server requests
 */
'use strict';

const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

class Handler {
    static validate(handler) {
        return (
            typeof(handler.id) === 'string' &&
            typeof(handler.handle) === 'function'
        );
    }

    constructor() {}

    get id() {
        return '';
    }

    handle(query, payload) {
        return {
            'statusCode': 200,
            'data': {'message': 'Server request handled!'}
        };
    }
}

class NotFoundHandler extends Handler {
    handle(query, payload) {
        return {
            'statusCode': 404,
            'data': {'message': 'Handler not found.'}
        };
    }
}

class HandlerManager {
    static validate(handlerManager) {
        return (
            typeof(handlerManager.handle) === 'function'
        );
    }

    constructor() {
        this.handlers = {};
    }

    // Add handler for a specific request
    addHandler(handler) {
        if (Handler.validate(handler)) {
            this.handlers[handler.id] = handler;
        }
    }

    getHandler(path) {
        // Get specific request handler
        const trimmedPath = path.replace(/^\/+|\/+$/g, '');
        if (trimmedPath === '') {
            return new Handler();
        }

        if (typeof(this.handlers[trimmedPath]) === 'undefined') {
            // If one is not found, use the notFound handler
            return new NotFoundHandler();
        }

        return this.handlers[trimmedPath];
    }

    // Handle http request
    handle(request, response) {
        // Get the url and parse it
        const parsedUrl = url.parse(request.url);

        // Choose the handler this request should go to.
        const requestHandler = this.getHandler(parsedUrl.pathname);
        
         // Get the payload, if any
        const decoder = new StringDecoder('utf-8');
        let buffer = '';
        request.on('data', (data) => {
            buffer += decoder.write(data);
        });
        request.on('end', () => {
            buffer += decoder.end();
            const payload = buffer === '' ? null : JSON.parse(buffer);

            // Get handler data to response
            const {statusCode, data} = 
                requestHandler.handle(parsedUrl.query, payload);

            // Send response
            this.sendResponse(response, statusCode, data);
        });
    }

    sendResponse(response, statusCode, data) {
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(statusCode);
        response.end(JSON.stringify(data));
    }
}

module.exports = {
    'Handler': Handler,
    'HandlerManager': HandlerManager
}