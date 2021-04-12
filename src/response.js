import { isValid as isValidStatusCode, statusCodes } from './status-codes';

/**
 * Build a valid reponse message.
 *
 * @param {number} statusCode
 * @param {array} headers
 * @param {object|array} body
 *
 * @return {object}
 */
export default function buildJsonResponse({ statusCode, headers, body }) {
    if (statusCode?.constructor !== Number || !isValidStatusCode(statusCode)) {
        throw new Error('statusCode must have a valid http status code');
    }

    if (headers?.constructor !== Array) {
        throw new Error('headers must have a valid array');
    }

    if (body?.constructor !== Object && body?.constructor !== Array) {
        throw new Error('body must have a valid object');
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        statusCode,
        body,
    };
}

export { buildJsonResponse, statusCodes, isValidStatusCode };
