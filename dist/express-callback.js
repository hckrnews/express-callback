function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var http = _interopDefault(require('http'));

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
 * @param {number} statusCode
 * @param {object} headers
 * @param {object|array} body
 *
 * @return {object}
 */

function buildJsonResponse({
  statusCode,
  headers = {},
  body
}) {
  if (statusCode?.constructor !== Number || !isValid(statusCode)) {
    throw new Error('statusCode must have a valid http status code');
  }

  if (headers?.constructor !== Object) {
    throw new Error('headers must have a valid object');
  }

  if (body?.constructor !== Object && body?.constructor !== Array) {
    throw new Error('body must have a valid object');
  }

  return {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      ...headers
    },
    statusCode,
    body
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
      const httpResponse = buildJsonResponse(response);

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

exports.buildJsonResponse = buildJsonResponse;
exports.default = makeExpressCallback;
exports.getStatusByError = getStatusByError;
exports.isValidStatusCode = isValid;
exports.makeExpressCallback = makeExpressCallback;
exports.statusCodes = statusCodes;
//# sourceMappingURL=express-callback.js.map
