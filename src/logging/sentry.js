import * as Sentry from '@sentry/node';
import Obj from '@hckrnews/objects';

/**
 * The logging object
 * @typedef {Object} Logging
 * @property {String} type
 * @property {String} release
 * @property {String} environment
 * @property {Number} tracesSampleRate
 * @property {Boolean} debug
 */

const schema = {
    dsn: String,
    release: String,
    environment: String,
    tracesSampleRate: Number,
    debug: Boolean,
};
const Logging = Obj({ schema });

export default ({
    dsn,
    release,
    environment = 'production',
    tracesSampleRate = 1,
    debug = false,
}) => {
    const logging = Logging.create({
        dsn,
        release,
        environment,
        tracesSampleRate,
        debug,
    });
    Sentry.init({
        dsn: logging.dsn,
        release: logging.release,
        environment: logging.environment,
        tracesSampleRate: logging.tracesSampleRate,
        debug: logging.debug,
    });

    return Sentry;
};
