import { isValid as isValidStatusCode, statusCodes } from './status-codes';

/**
 * Build a valid reponse message.
 *
 * @param {number} statusCode
 * @param {object|array} body
 *
 * @return {object}
 */
export default function buildJsonResponse({ statusCode, body }) {
    if (
        statusCode?.constructor.name !== 'Number' ||
        !isValidStatusCode(statusCode)
    ) {
        throw new Error('statusCode must have a valid http status code');
    }

    if (
        body?.constructor.name !== 'Object' &&
        body?.constructor.name !== 'Array'
    ) {
        throw new Error('body must have a valid object');
    }

    return {
        headers: {
            'Content-Type': 'application/json',
        },
        statusCode,
        body,
    };
}

export { buildJsonResponse, statusCodes, isValidStatusCode };
