const { BABEL_ENV } = process.env;

const isBuilding = BABEL_ENV !== undefined && BABEL_ENV !== 'cjs';

const presets = [
    [
        '@babel/preset-env',
        {
            loose: true,
            modules: isBuilding ? false : 'commonjs',
        },
    ],
    '@babel/preset-react',
];
const plugins = [
    'lodash',
    [
        'babel-plugin-styled-components',
        { ssr: true, displayName: true, preprocess: false },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
];

module.exports = {
    presets,
    plugins,
};
