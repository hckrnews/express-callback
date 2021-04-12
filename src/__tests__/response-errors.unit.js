import { buildJsonResponse } from '../response';

const TestCases = [
    {
        description:
            'The statusCode should be a valid http status code, and a number',
        statusCode: '200',
        body: {},
        expectedResult: 'statusCode must have a valid http status code',
    },
    {
        description: 'The statusCode should be a valid http status code',
        statusCode: 123,
        body: {},
        expectedResult: 'statusCode must have a valid http status code',
    },
    {
        description: 'The headers should be a valid array or object',
        statusCode: 200,
        headers: 'invalid headers',
        body: {},
        expectedResult: 'headers must have a valid object',
    },
    {
        description: 'The body should be a valid array or object',
        statusCode: 200,
        body: 'example',
        expectedResult: 'body must have a valid object',
    },
];

describe.each(TestCases)(
    'Response entity errors',
    ({ description, statusCode, headers, body, expectedResult }) => {
        it(description, () => {
            expect(() =>
                buildJsonResponse({ statusCode, headers, body })
            ).toThrow(expectedResult);
        });
    }
);
