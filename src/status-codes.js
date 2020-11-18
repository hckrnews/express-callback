import http from 'http';

export const statusCodes = Object.keys(http.STATUS_CODES).map(Number);

export function isValid(statusCode) {
    return statusCodes.includes(statusCode);
}
