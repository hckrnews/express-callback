import { expect, describe, it } from '@jest/globals';
import { isValid } from '../status-codes.js';

const TestCases = [
    {
        description: 'The statusCode 200 should be valid',
        statusCode: 200,
        expectedResult: true,
    },
    {
        description: 'The statusCode 201 should be valid',
        statusCode: 201,
        expectedResult: true,
    },
    {
        description: 'The statusCode 401 should be valid',
        statusCode: 401,
        expectedResult: true,
    },
    {
        description: 'The statusCode 404 should be valid',
        statusCode: 404,
        expectedResult: true,
    },
    {
        description: 'The statusCode 500 should be valid',
        statusCode: 500,
        expectedResult: true,
    },
    {
        description: 'The statusCode 123 should be invalid',
        statusCode: 123,
        expectedResult: false,
    },
];

describe.each(TestCases)(
    'Status codes helper',
    ({ description, statusCode, expectedResult }) => {
        it(description, () => {
            expect(isValid(statusCode)).toBe(expectedResult);
        });
    }
);
