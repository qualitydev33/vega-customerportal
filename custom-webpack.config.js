const { merge } = require('webpack-merge');
const path = require('path');

module.exports = (config, context) => {
    return merge(config, {
        module: {
            rules: [
                {
                    test: /\.(?:js|jsx|mjs|cjs|ts|tsx)$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript', '@babel/preset-react', ['@babel/preset-env', { targets: 'defaults' }]],
                            plugins: ['babel-plugin-styled-components'],
                        },
                    },
                    exclude: ['/node_modules/'],
                    include: [path.resolve('node_modules/react-schedule-selector')],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack', 'file-loader'],
                },
                {
                    test: /\.(png|jpg|gif|ico|pdf|yaml|html|csv)$/,
                    use: 'file-loader',
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/',
                            },
                        },
                    ],
                },
            ],
        },
    });
};
