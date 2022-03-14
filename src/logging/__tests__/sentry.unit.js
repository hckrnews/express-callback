import { expect, describe, it } from '@jest/globals';
import makeSentry from '../sentry.js';

describe('Test the sentry logging', () => {
    it('It should work with minimum info', () => {
        const logging = {
            dsn: 'https://12345678@234567151173.ingest.sentry.io/1234567',
            release: '1.2.3',
        };
        const Sentry = makeSentry(logging);
        expect(Sentry.captureException).toBeDefined();
    });

    it('It should work with all details', () => {
        const logging = {
            dsn: 'https://12345678@234567151173.ingest.sentry.io/1234567',
            release: '1.2.3',
            environment: 'production',
            tracesSampleRate: 1,
            debug: false,
        };
        const Sentry = makeSentry(logging);
        expect(Sentry.captureException).toBeDefined();
    });
});
