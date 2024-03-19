module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json'],

    transform: {
        '^.+\\.js?$': 'babel-jest',
    },

    transformIgnorePatterns: ['node_modules/(?!(@hckrnews|mime)/)'],

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    testMatch: ['**/__tests__/*.js'],

    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
};
