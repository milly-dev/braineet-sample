import React from 'react';
import App from 'next/app';
import * as Sentry from '@sentry/node';
import whyDidYouRender from '@welldone-software/why-did-you-render';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    whyDidYouRender(React);
}
Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.SENTRY_DSN,
    release: `braineet-worfklow@${process.env.npm_package_version}`,
});

class MyApp extends App {
    static getInitialProps = async ({ Component, ctx }) => {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        pageProps.namespacesRequired = ['common'];

        return {
            pageProps,
        };
    };

    render() {
        const { Component, pageProps, router, err } = this.props;

        const getLayout = Component.getLayout || (page => page);

        return (
            <>
                {getLayout(
                    <Component {...pageProps} router={router} err={err} />,
                )}
            </>
        );
    }
}

export default MyApp;
