const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
    ...nxPreset,
    moduleNameMapper: {
        'typeface-inter': 'identity-obj-proxy',
    },
    transformIgnorePatterns: ['/node_modules/(' + ['mui/material/styles/'].join('|') + ')', 'jest-runner'],
};
