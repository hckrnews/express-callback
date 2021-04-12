import { buildJsonResponse } from '../response';

const TestCases = [
    {
        description: 'Test a simple request',
        params: {
            statusCode: 200,
            body: {},
        },
        expectedResult: {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
            },
            statusCode: 200,
            body: {},
        },
    },
    {
        description: 'Test a simple request',
        params: {
            statusCode: 201,
            headers: {
                test: 'ok',
            },
            body: {
                example: 42,
            },
        },
        expectedResult: {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
                test: 'ok',
            },
            statusCode: 201,
            body: {
                example: 42,
            },
        },
    },
];

describe.each(TestCases)(
    'Response entity',
    ({ description, params, expectedResult }) => {
        it(description, () => {
            expect(buildJsonResponse(params)).toEqual(expectedResult);
        });
    }
);
