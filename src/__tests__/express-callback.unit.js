import { expect, describe, it } from '@jest/globals';
import { makeExpressCallback } from '../express-callback.js';

const res = {
    values: {
        set: null,
        type: null,
        status: null,
        send: null,
        headers: {},
    },
    set(value) {
        this.values.set = value;
    },
    type(value) {
        this.values.type = value;
    },
    status(value) {
        this.values.status = value;
        return {
            send: (value2) => {
                this.values.send = value2;
            },
            json: (value2) => {
                this.values.send = value2;
            },
        };
    },
    json(value) {
        this.values.send = value;
    },
    send(value) {
        this.values.send = value;
    },
    setHeader(key, value) {
        this.values.headers[key] = value;
    },
};

const specification = {
    info: {
        version: '1.2.3',
    },
};

const logger = {
    error: () => {},
    warn: () => {},
};

const meta = {};

describe('Test the express callback', () => {
    it('It should work', async () => {
        const currentRes = { ...res, values: { ...res.values } };

        const controller = () => ({
            headers: {
                'Content-Type': 'text/xml',
                'Cache-Control': 'no-store, max-age=0',
                example: 'ok',
            },
            statusCode: 200,
            body: {},
        });

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {};
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual({
            'Content-Type': 'text/xml',
            'Cache-Control': 'no-store, max-age=0',
            example: 'ok',
        });
        expect(currentRes.values.status).toEqual(200);
        expect(currentRes.values.type).toEqual('text/xml');
    });

    it('It should work with attachments', async () => {
        const currentRes = { ...res, values: { ...res.values } };

        const controller = () => ({
            headers: {},
            statusCode: 200,
            body: {},
            attachment: true,
        });

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {
            request: {
                headers: {
                    accept: 'text/csv',
                },
            },
        };
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual({
            'Content-Type': 'text/csv',
            'Cache-Control': 'no-store, max-age=0',
        });
        expect(currentRes.values.status).toEqual(200);
        expect(currentRes.values.type).toEqual('text/csv');
        expect(currentRes.values.headers).toEqual({
            'Content-Disposition': 'attachment; filename="download.csv";',
        });
    });

    it('It should work with the accept header', async () => {
        const currentRes = { ...res, values: { ...res.values } };

        const controller = () => ({
            statusCode: 200,
            body: {},
        });

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {
            request: {
                headers: {
                    accept: 'text/xml',
                },
            },
        };
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual({
            'Content-Type': 'text/xml',
            'Cache-Control': 'no-store, max-age=0',
        });
        expect(currentRes.values.status).toEqual(200);
        expect(currentRes.values.type).toEqual('text/xml');
    });

    it('It should work without the headers', async () => {
        const currentRes = { ...res, values: { ...res.values } };

        const controller = () => ({
            statusCode: 200,
            body: {},
        });

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {};
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
        });
        expect(currentRes.values.status).toEqual(200);
        expect(currentRes.values.type).toEqual('application/json');
    });

    it('Test the catcher', async () => {
        const currentRes = { ...res, values: { ...res.values } };
        const controller = () => {
            throw new Error('example error');
        };

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {};
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual(null);
        expect(currentRes.values.status).toEqual(500);
        expect(currentRes.values.type).toEqual(null);
        expect(currentRes.values.send.status).toEqual(500);
        expect(currentRes.values.send.message).toEqual('example error');
    });

    it('Test the catcher with a type error', async () => {
        const currentRes = { ...res, values: { ...res.values } };
        const controller = () => {
            throw new TypeError('example error');
        };

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            meta,
        });
        const context = {};
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual(null);
        expect(currentRes.values.status).toEqual(422);
        expect(currentRes.values.type).toEqual(null);
        expect(currentRes.values.send.status).toEqual(422);
        expect(currentRes.values.send.message).toEqual('example error');
    });

    it('It should work with the error logger', async () => {
        const currentRes = { ...res, values: { ...res.values } };
        const controller = () => {
            throw new Error('example error');
        };

        const expressCallback = makeExpressCallback({
            controller,
            specification,
            logger,
            errorLogger: { error: (error) => {} },
            meta,
        });
        const context = {};
        const req = {};
        await expressCallback(context, req, currentRes);

        expect(currentRes.values.set).toEqual(null);
        expect(currentRes.values.status).toEqual(500);
        expect(currentRes.values.type).toEqual(null);
        expect(currentRes.values.send.status).toEqual(500);
        expect(currentRes.values.send.message).toEqual('example error');
    });
});
