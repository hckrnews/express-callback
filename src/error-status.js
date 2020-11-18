const errorCodesStatus = [
    {
        type: TypeError,
        status: 422,
    },
    {
        type: RangeError,
        status: 404,
    },
    {
        type: Error,
        status: 500,
    },
];

/**
 * Get a http status when you send an error.
 * When it is a error, throw back the error.
 *
 * @param {Error} error
 *
 * @return {number}
 */
export default (error) =>
    errorCodesStatus.find((errorCode) => error instanceof errorCode.type)
        .status;
