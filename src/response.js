import { isValid as isValidStatusCode, statusCodes } from './status-codes.js';

/**
 * Build a valid reponse message.
 *
 * @param {object} param
 * @param {number=} param.statusCode
 * @param {object=} param.headers
 * @param {object|array=} param.body
 * @param {boolean=} param.attachment
 * @param {object=} specification
 * @param {string=} contentType
 *
 * @return {object}
 */
export default function buildResponse(
    { statusCode = 200, headers = {}, body = null, attachment = false },
    specification = {},
    contentType = 'application/json'
) {
    if (statusCode?.constructor !== Number || !isValidStatusCode(statusCode)) {
        throw new Error('statusCode must have a valid http status code');
    }

    if (headers?.constructor !== Object) {
        throw new Error('headers must have a valid object');
    }

    if (
        body &&
        body?.constructor !== Object &&
        body?.constructor !== Array &&
        contentType === 'application/json'
    ) {
        throw new Error('body must have a valid object');
    }

    if (specification?.constructor !== Object) {
        throw new Error('specification must have a valid object');
    }

    const defaultBody = {
        status: true,
        version: specification?.info?.version ?? 'unknown',
        timestamp: new Date(),
        message: 'ok',
    };

    return {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'no-store, max-age=0',
            ...headers,
        },
        statusCode,
        body: body ?? defaultBody,
        attachment,
    };
}

export { buildResponse, statusCodes, isValidStatusCode };
