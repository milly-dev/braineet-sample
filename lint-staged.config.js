const escape = require('shell-quote').quote;
const { CLIEngine } = require('eslint');

const cli = new CLIEngine({});
const isWin = process.platform === 'win32';

module.exports = {
    '**/*.{js,jsx}': filenames => {
        const escapedFileNames = filenames
            .map(filename => `"${isWin ? filename : escape([filename])}"`)
            .join(' ');
        return [
            `prettier --with-node-modules --write ${escapedFileNames}`,
            `stylelint ${escapedFileNames}`,
            `eslint --no-ignore --max-warnings=0 --fix ${filenames
                .filter(file => !cli.isPathIgnored(file))
                .map(f => `"${f}"`)
                .join(' ')}`,
            `git add ${escapedFileNames}`,
        ];
    },
    '**/*.{json,md,mdx,css,html,yml,yaml,scss}': filenames => {
        const escapedFileNames = filenames
            .map(filename => `"${isWin ? filename : escape([filename])}"`)
            .join(' ');
        return [
            `prettier --with-node-modules --write ${escapedFileNames}`,
            `git add ${escapedFileNames}`,
        ];
    },
};
