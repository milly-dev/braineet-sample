/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import NextErrorComponent from 'next/error';
import * as Sentry from '@sentry/node';

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
    if (!hasGetInitialPropsRun && err) {
        Sentry.captureException(err);
    }

    return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async ({ res, err, asPath }) => {
    const errorInitialProps = await NextErrorComponent.getInitialProps({
        res,
        err,
    });

    errorInitialProps.hasGetInitialPropsRun = true;

    if (res?.statusCode === 404) {
        return { statusCode: 404 };
    }
    if (err) {
        Sentry.captureException(err);
        return errorInitialProps;
    }
    Sentry.captureException(
        new Error(`_error.js getInitialProps missing data at path: ${asPath}`),
    );
    return errorInitialProps;
};

MyError.propTypes = {
    statusCode: PropTypes.number.isRequired,
    hasGetInitialPropsRun: PropTypes.bool.isRequired,
    err: PropTypes.any.isRequired,
};

export default MyError;
