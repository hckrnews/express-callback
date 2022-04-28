import getStatusByError from './error-status.js';
import { buildResponse, statusCodes, isValidStatusCode } from './response.js';

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

            const contentType =
                context?.request?.headers?.accept ?? 'application/json';

            const httpResponse = buildResponse(
                response,
                specification,
                contentType
            );

            res.set(httpResponse.headers);

            res.type(contentType);
            res.status(httpResponse.statusCode).send(httpResponse.body);
        } catch (error) {
            const errorCodeStatus = getStatusByError(error);

            logger.error(error);

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
    buildResponse,
    statusCodes,
    isValidStatusCode,
};
