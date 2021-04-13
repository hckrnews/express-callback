(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('http')) :
    typeof define === 'function' && define.amd ? define(['exports', 'http'], factory) :
    (global = global || self, factory(global.expressCallback = {}, global.http));
}(this, (function (exports, http) {
    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var http__default = /*#__PURE__*/_interopDefaultLegacy(http);

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

    const statusCodes = Object.keys(http__default['default'].STATUS_CODES).map(Number);
    function isValid(statusCode) {
      return statusCodes.includes(statusCode);
    }

    /**
     * Build a valid reponse message.
     *
     * @param {number} statusCode, {object} headers, {object|array} body
     * @param {object} specification
     *
     * @return {object}
     */

    function buildJsonResponse({
      statusCode = 200,
      headers = {},
      body = null
    }, specification = {}) {
      var _specification$info;

      if ((statusCode == null ? void 0 : statusCode.constructor) !== Number || !isValid(statusCode)) {
        throw new Error('statusCode must have a valid http status code');
      }

      if ((headers == null ? void 0 : headers.constructor) !== Object) {
        throw new Error('headers must have a valid object');
      }

      if (body && (body == null ? void 0 : body.constructor) !== Object && (body == null ? void 0 : body.constructor) !== Array) {
        throw new Error('body must have a valid object');
      }

      if ((specification == null ? void 0 : specification.constructor) !== Object) {
        throw new Error('specification must have a valid object');
      }

      const defaultBody = {
        status: true,
        version: (specification == null ? void 0 : (_specification$info = specification.info) == null ? void 0 : _specification$info.version) ?? 'unknown',
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

    exports.buildJsonResponse = buildJsonResponse;
    exports.default = makeExpressCallback;
    exports.getStatusByError = getStatusByError;
    exports.isValidStatusCode = isValid;
    exports.makeExpressCallback = makeExpressCallback;
    exports.statusCodes = statusCodes;

})));
//# sourceMappingURL=express-callback.umd.js.map
