import { expect, describe, it } from '@jest/globals';
import { makeExpressCallback } from '../express-callback.js';

const res = {
    values: {
        set: null,
        type: null,
        status: null,
        send: null,
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
        };
    },
};

const specification = {
    info: {
        version: '1.2.3',
    },
};

const logger = {
    error: () => {},
};

const meta = {};

describe('Test the express callback', () => {
    it('It should work', async () => {
        const currentRes = { ...res, values: { ...res.values } };

        const controller = () => ({
            headers: {
                'Content-Type': 'application/json',
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
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
            example: 'ok',
        });
        expect(currentRes.values.status).toEqual(200);
        expect(currentRes.values.type).toEqual('json');
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
        expect(currentRes.values.type).toEqual('json');
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
