import http from 'http';

export const statusCodes = Object.keys(http.STATUS_CODES).map(Number);

/**
 * Check if the statuscode is valid
 *
 * @param {number} statusCode
 * @returns {boolean}
 */
export function isValid(statusCode) {
    return statusCodes.includes(statusCode);
}
