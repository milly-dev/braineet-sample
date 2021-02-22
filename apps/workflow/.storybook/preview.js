import { Provider as ThemeProvider, Pane } from '@braineet/ui';
import { createGlobalStyle } from 'styled-components';

import { useTranslation } from 'react-i18next';
import i18next from './i18n';

const StorybookGlobalStyle = createGlobalStyle`
html, body, #root {
    height: 100%
}
`;
i18next('en');

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        defaultValue: 'en',
        toolbar: {
            icon: 'globe',
            items: [
                { value: 'en', right: '🇺🇸', title: 'English' },
                { value: 'fr', right: '🇫🇷', title: 'Français' },
                { value: 'pt-BR', right: '🇧🇷', title: 'Portuguese' },
            ],
        },
    },
};

export const decorators = [
    (Story, { globals: { locale } }) => {
        const { i18n } = useTranslation();
        React.useEffect(() => {
            i18n.changeLanguage(locale);
        }, [locale]);

        return (
            <ThemeProvider>
                <StorybookGlobalStyle />
                <Story />
            </ThemeProvider>
        );
    },
];
