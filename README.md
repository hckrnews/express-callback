# Express callback

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-stats]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Scrutinizer Code Quality][scrutinizer-image]][scrutinizer-url]


```javascript
import OpenAPIBackend from 'openapi-backend';
import { makeExpressCallback } from '@hckrnews/express-callback'

const specification = {
    info: {
        version: '1.2.3',
    }
}

const logger = {}

const meta = {}

const getPetsController = ({
    context,
    specification,
    logger,
    errorLogger,
    req,
    res,
    meta,
}) => {
    // do something

    return {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
        },
        statusCode: 200,
        body: {

        },
    }
}

const api = new OpenAPIBackend({ definition: specification });

api.register({
    getPets: makeExpressCallback({
        controller: getPetsController,
        specification,
        logger,
        errorLogger: { error: (error) => {} },
        meta
    })
});

api.init();

```

[downloads-image]: https://img.shields.io/npm/dm/@hckrnews/express-callback.svg
[npm-url]: https://www.npmjs.com/package/@hckrnews/express-callback
[npm-image]: https://img.shields.io/npm/v/@hckrnews/express-callback.svg
[npm-stats]: https://npm-stat.com/charts.html?package=@hckrnews/express-callback
[travis-url]: https://scrutinizer-ci.com/g/hckrnews/express-callback/build-status/main
[travis-image]: https://scrutinizer-ci.com/g/hckrnews/express-callback/badges/build.png?b=main
[coveralls-url]: https://scrutinizer-ci.com/g/hckrnews/express-callback/?branch=main
[coveralls-image]: https://scrutinizer-ci.com/g/hckrnews/express-callback/badges/coverage.png?b=main
[scrutinizer-url]: https://scrutinizer-ci.com/g/hckrnews/express-callback/?branch=main
[scrutinizer-image]: https://scrutinizer-ci.com/g/hckrnews/express-callback/badges/quality-score.png?b=main
