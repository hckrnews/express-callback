import { buildJsonResponse } from '../response';

const TestCases = [
    {
        description: 'The statusCode should be a valid http status code',
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
        description: 'The body should be a valid array or object',
        statusCode: 200,
        body: 'example',
        expectedResult: 'body must have a valid object',
    },
];

describe.each(TestCases)(
    'Response entity',
    ({ description, statusCode, body, expectedResult }) => {
        it(description, async () => {
            expect(async () =>
                buildJsonResponse({ statusCode, body })
            ).rejects.toThrow(expectedResult);
        });
    }
);
