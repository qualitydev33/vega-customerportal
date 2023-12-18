const { merge } = require('webpack-merge');

module.exports = (config, context) => {
    return merge(config, {
        module: {
            rules: [
                {
                    test: /\.(json|csv)$/,
                    use: 'file-loader',
                },
                {
                    test: /\.svg$/,
                    use: '@svgr/webpack',
                },
                {
                    test: /\.(png|jpg|gif|ico|pdf|yaml)$/,
                    use: 'file-loader',
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    use: 'file-loader',
                },
            ],
        },
    });
};
