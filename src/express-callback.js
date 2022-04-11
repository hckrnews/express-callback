import getStatusByError from './error-status.js';
import {
    buildJsonResponse,
    statusCodes,
    isValidStatusCode,
} from './response.js';

export default function makeExpressCallback({
    controller,
    specification,
    logger,
    errorLogger = null,
    meta,
}) {
    return async (context, req, res) => {
        try {
            const response = await controller({
                context,
                specification,
                logger,
                req,
                res,
                meta,
            });
            const httpResponse = buildJsonResponse(response, specification);

            res.set(httpResponse.headers);

            res.type('json');
            res.status(httpResponse.statusCode).send(httpResponse.body);
        } catch (error) {
            const errorCodeStatus = getStatusByError(error);

            if (errorCodeStatus >= 500) {
                logger.error(error);
            } else {
                logger.warn(error);
            }

            res.status(errorCodeStatus).send({
                status: errorCodeStatus,
                timestamp: new Date(),
                message: error.message,
            });

            if (errorLogger) {
                errorLogger.error(error);
            }
        }
    };
}

export {
    makeExpressCallback,
    getStatusByError,
    buildJsonResponse,
    statusCodes,
    isValidStatusCode,
};
