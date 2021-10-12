import { expect, describe, it } from '@jest/globals'
import getStatusByError from '../error-status';

const TestCases = [
    {
        description: 'A normal error should return status 500',
        error: new Error('test'),
        expectedResult: 500,
    },
    {
        description: 'A type error should return status 422',
        error: new TypeError('test'),
        expectedResult: 422,
    },
    {
        description: 'A range error should return status 404',
        error: new RangeError('test'),
        expectedResult: 404,
    },
];

describe.each(TestCases)(
    'Error status entity',
    ({ description, error, expectedResult }) => {
        it(description, () => {
            expect(getStatusByError(error)).toEqual(expectedResult);
        });
    }
);
