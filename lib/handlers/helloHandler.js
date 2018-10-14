/**
 * Define /hello request handler
 */
'use strict';

const Handler = require('../server/httpRequestHandler').Handler;

class HelloHandler extends Handler {

    constructor() {
        super();
    }

    get id() {
        return 'hello';
    }

    handle(query, payload) {
        return {
            'statusCode': 200,
            'data': {'message': 'Wellcome to The NodeJs Master Class, Assignment #1'}
        }
    }
}

module.exports = HelloHandler;