import mime from 'mime';
import getStatusByError from './error-status.js';
import { buildResponse, statusCodes, isValidStatusCode } from './response.js';

/**
 * @typedef {(context: object, req: object, res: object) => Promise<void>} expressCallback
 */

/**
 * Make Express callback
 *
 * @param {object} param
 * @param {Function|Promise<any>} param.controller
 * @param {object} param.specification
 * @param {object} param.logger
 * @param {object=} param.errorLogger
 * @param {object=} param.meta
 * @return {expressCallback}
 */
export default function makeExpressCallback({
    controller,
    specification,
    logger,
    errorLogger = null,
    meta,
}) {
    /**
     * Handle controller
     *
     * @async
     * @param {object} context
     * @param {object} req
     * @param {object} res
     * @returns {Promise<void>}
     */
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

            if (httpResponse.statusCode === 201) {
                res.end();
            } else if (contentType === 'application/json') {
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
