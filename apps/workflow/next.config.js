/* eslint-disable no-param-reassign */

require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');
const withCSS = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withTM = require('next-transpile-modules')([
    '@braineet/ui',
    'mixin-deep',
]);

const {
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
} = process.env;

module.exports = withTM(
    withSourceMaps(
        withCSS({
            webpack: (config, { dev, isServer, buildId }) => {
                if (!isServer) {
                    config.resolve.alias['@sentry/node'] = '@sentry/browser';
                }
                if (
                    SENTRY_DSN &&
                    SENTRY_ORG &&
                    SENTRY_PROJECT &&
                    SENTRY_AUTH_TOKEN &&
                    NODE_ENV === 'production'
                ) {
                    config.plugins.push(
                        new SentryWebpackPlugin({
                            include: '.next',
                            ignore: ['node_modules'],
                            urlPrefix: '~/_next',
                            release: buildId,
                        }),
                    );
                }
                if (dev) {
                    config.devtool = 'cheap-module-source-map';
                }
                const originalEntry = config.entry;
                config.entry = async () => {
                    const entries = await originalEntry();

                    if (
                        entries['main.js'] &&
                        !entries['main.js'].includes('./polyfills.js')
                    ) {
                        entries['main.js'].unshift('./polyfills.js');
                    }

                    return entries;
                };
                config.plugins = config.plugins || [];
                config.plugins = [
                    ...config.plugins,
                    new Dotenv({
                        path: path.join(
                            __dirname,
                            `env/.env.${process.env.APP_ENV ||
                                process.env.NODE_ENV ||
                                'development'}`,
                        ),
                        systemvars: true,
                    }),
                ];
                config.optimization.minimizer[0].options.terserOptions.compress.inline = false;
                return config;
            },
        }),
    ),
);
