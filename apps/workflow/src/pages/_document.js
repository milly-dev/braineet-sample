import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class CustomDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: App => props => {
                        return sheet.collectStyles(<App {...props} />);
                    },
                });

            const initialProps = await Document.getInitialProps(ctx);

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <meta httpEquiv="X-UA-Compatible" content="IE=EDGE" />
                    <meta
                        httpEquiv="Content-Type"
                        content="text/html; charset=UTF-8"
                    />
                    <meta name="Description" content="Workflow app" />
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href="https://data.braineet.com/braineet/assets/logo-workflow.png"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
