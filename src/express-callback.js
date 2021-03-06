import getStatusByError from './error-status';
import { buildJsonResponse, statusCodes, isValidStatusCode } from './response';

export default function makeExpressCallback({
    controller,
    specification,
    logger,
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
                message: error.message,
            });
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
