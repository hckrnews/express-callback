import { expect, describe, it } from '@jest/globals';
import { buildResponse } from '../response.js';

const TestCases = [
    {
        description: 'Test a simple request',
        params: { body: {} },
        specification: {},
        expectedResult: {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            },
            statusCode: 200,
            body: {},
            attachment: false,
        },
    },
    {
        description: 'It should overwrite the status code',
        params: {
            statusCode: 204,
            body: {},
        },
        specification: {
            info: {
                version: '1.2.3',
            },
        },
        expectedResult: {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            },
            statusCode: 204,
            body: {},
            attachment: false,
        },
    },
    {
        description: 'It should add the extra header',
        params: {
            statusCode: 201,
            headers: {
                test: 'ok',
            },
            body: {},
        },
        specification: {},
        expectedResult: {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
                test: 'ok',
            },
            statusCode: 201,
            body: {},
            attachment: false,
        },
    },
    {
        description: 'It should overwrite the default headers',
        params: {
            statusCode: 201,
            headers: {
                'Content-Type': 'text/csv',
                'Cache-Control': 'private',
                test: 'ok',
            },
            body: {
                example: 42,
            },
            attachment: true,
        },
        specification: {},
        expectedResult: {
            headers: {
                'Content-Type': 'text/csv',
                'Cache-Control': 'private',
                test: 'ok',
            },
            statusCode: 201,
            body: {
                example: 42,
            },
            attachment: true,
        },
    },
];

describe.each(TestCases)(
    'Response entity',
    ({ description, params, specification, expectedResult }) => {
        it(description, () => {
            expect(buildResponse(params, specification)).toEqual(
                expectedResult
            );
        });
    }
);

describe('Response without a specification', () => {
    it('It should generate a response body if no body is send', () => {
        const response = buildResponse({});
        expect(response.headers).toEqual({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.status).toEqual(true);
        expect(response.body.version).toEqual('unknown');
        expect(response.body.message).toEqual('ok');
    });
});

describe('Response with a specification', () => {
    it('It should generate a response body if no body is send', () => {
        const response = buildResponse(
            {},
            {
                info: {
                    version: '1.2.3',
                },
            }
        );
        expect(response.headers).toEqual({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, max-age=0',
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.status).toEqual(true);
        expect(response.body.version).toEqual('1.2.3');
        expect(response.body.message).toEqual('ok');
    });
});
