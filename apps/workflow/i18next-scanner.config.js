/* eslint-disable no-plusplus */
const fs = require('fs');
const chalk = require('chalk');

module.exports = {
    input: [
        '**/**/*.{js,jsx}',
        // Use ! to filter out files or directories
        '!**/tinymce/**',
        '!**/dist/**',
        '!**/.next/**',
        '!**/skin/**',
        '!node_modules/**',
    ],
    output: './',
    options: {
        debug: false,
        func: {
            list: ['t'],
            extensions: ['.js', '.jsx'],
        },
        lngs: ['en', 'fr', 'pt-BR'],
        ns: ['common'],
        defaultNs: 'common',
        defaultLng: 'en',
        defaultValue: '__STRING_NOT_TRANSLATED__',
        resource: {
            loadPath: 'public/static/locales/{{lng}}/{{ns}}.json',
            savePath: 'public/static/locales/{{lng}}/{{ns}}.json',
            jsonIndent: 4,
            lineEnding: '\n',
        },
        nsSeparator: false, // namespace separator
        keySeparator: '.', // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}',
        },
    },
    transform: function customTransform(file, enc, done) {
        const { parser } = this;
        const content = fs.readFileSync(file.path, enc);
        let count = 0;

        parser.parseFuncFromString(content, { list: ['t'] }, (key, options) => {
            parser.set(key, {
                ...options,
                nsSeparator: false,
                keySeparator: '.',
            });
            ++count;
        });

        if (count > 0) {
            console.log(
                `i18next-scanner: count=${chalk.cyan(
                    count,
                )}, file=${chalk.yellow(JSON.stringify(file.relative))}`,
            );
        }

        done();
    },
};
