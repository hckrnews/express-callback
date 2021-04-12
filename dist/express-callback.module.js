import http from 'http';

const errorCodesStatus = [{
  type: TypeError,
  status: 422
}, {
  type: RangeError,
  status: 404
}, {
  type: Error,
  status: 500
}];
/**
 * Get a http status when you send an error.
 * When it is a error, throw back the error.
 *
 * @param {Error} error
 *
 * @return {number}
 */

var getStatusByError = (error => errorCodesStatus.find(errorCode => error instanceof errorCode.type).status);

const statusCodes = Object.keys(http.STATUS_CODES).map(Number);
function isValid(statusCode) {
  return statusCodes.includes(statusCode);
}

/**
 * Build a valid reponse message.
 *
 * @param {object} statusCode, headers, body
 * @param {object} specification
 *
 * @return {object}
 */

function buildJsonResponse({
  statusCode = 200,
  headers = {},
  body = null
}, specification = {}) {
  if (statusCode?.constructor !== Number || !isValid(statusCode)) {
    throw new Error('statusCode must have a valid http status code');
  }

  if (headers?.constructor !== Object) {
    throw new Error('headers must have a valid object');
  }

  if (body && body?.constructor !== Object && body?.constructor !== Array) {
    throw new Error('body must have a valid object');
  }

  if (specification?.constructor !== Object) {
    throw new Error('specification must have a valid object');
  }

  const defaultBody = {
    status: true,
    version: specification?.info?.version ?? 'unknown',
    timestamp: new Date(),
    message: 'ok'
  };
  return {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      ...headers
    },
    statusCode,
    body: body ?? defaultBody
  };
}

function makeExpressCallback({
  controller,
  specification,
  logger,
  meta
}) {
  return async (context, req, res) => {
    try {
      const response = await controller({
        context,
        specification,
        logger,
        req,
        res,
        meta
      });
      const httpResponse = buildJsonResponse(response, specification);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }

      res.type('json');
      res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (error) {
      const errorCodeStatus = getStatusByError(error);

      if (errorCodeStatus >= 500) {
        logger.error(error.message);
      }

      res.status(errorCodeStatus).send({
        status: errorCodeStatus,
        timestamp: new Date(),
        message: error.message
      });
    }
  };
}

export default makeExpressCallback;
export { buildJsonResponse, getStatusByError, isValid as isValidStatusCode, makeExpressCallback, statusCodes };
//# sourceMappingURL=express-callback.module.js.map
