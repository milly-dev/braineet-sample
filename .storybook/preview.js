import React from 'react';
import { Provider as ThemeProvider } from '../packages/ui/src';

export const decorators = [
    Story => (
        <ThemeProvider>
            <Story />
        </ThemeProvider>
    ),
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    options: {
        storySort: {
            order: ['Feedback', 'Others'],
        },
    },
};
