const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');
const commonjs = require('@rollup/plugin-commonjs');
const url = require('@rollup/plugin-url');

module.exports = (config) => {
    const nxConfig = nrwlConfig(config);
    return {
        ...nxConfig,
        plugins: [
            commonjs(),
            url({ include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp', '**/*.pdf', '**/*.yaml', '**/*.html', '**/*.csv'] }),
            ...nxConfig.plugins,
        ],
    };
};
