import mime from 'mime';
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

            // also check if we can auto use the accept header
            // context.request.headers.accept
            const contentType =
                response?.headers?.['Content-Type'] ?? 'application/json';

            const httpResponse = buildResponse(
                response,
                specification,
                contentType
            );

            res.set(httpResponse.headers);

            res.type(contentType);
            res.status(httpResponse.statusCode);

            const extension = mime.getExtension(contentType);
            if (httpResponse?.attachment === true) {
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename="download.${extension}";`
                );
            }

            if (contentType === 'application/json') {
                res.json(httpResponse.body);
            } else {
                res.send(httpResponse.body);
            }
        } catch (error) {
            const errorCodeStatus = getStatusByError(error);

            logger.error(error);

            res.status(errorCodeStatus).json({
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
