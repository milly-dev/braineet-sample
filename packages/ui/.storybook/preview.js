import React from 'react';
import { createGlobalStyle } from 'styled-components';

const StorybookGlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%
}
`;
export const decorators = [
    Story => (
        <div>
            <StorybookGlobalStyle />
            <Story />
        </div>
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
