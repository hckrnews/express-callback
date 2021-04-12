import { buildJsonResponse } from '../response';

const TestCases = [
    {
        description:
            'The statusCode should be a valid http status code, and a number',
        params: {
            statusCode: '200',
            body: {},
        },
        specification: {},
        expectedResult: 'statusCode must have a valid http status code',
    },
    {
        description: 'The statusCode should be a valid http status code',
        params: {
            statusCode: 123,
            body: {},
        },
        specification: {},
        expectedResult: 'statusCode must have a valid http status code',
    },
    {
        description: 'The headers should be a valid array or object',
        params: {
            statusCode: 200,
            headers: 'invalid headers',
            body: {},
        },
        specification: {},
        expectedResult: 'headers must have a valid object',
    },
    {
        description: 'The body should be a valid array or object',
        params: {
            statusCode: 200,
            body: 'example',
        },
        specification: {},
        expectedResult: 'body must have a valid object',
    },
    {
        description: 'The specification should be a valid object',
        params: {},
        specification: 'invalid specification',
        expectedResult: 'specification must have a valid object',
    },
];

describe.each(TestCases)(
    'Response entity errors',
    ({ description, params, specification, expectedResult }) => {
        it(description, () => {
            expect(() => buildJsonResponse(params, specification)).toThrow(
                expectedResult
            );
        });
    }
);
