import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import MyHome from '../components/home/MyHome';
import myData from '../data/myData';

/* DO NOT TOUCH THIS COMPONENT */

const Home = () => {
    const [data, setData] = useState({});
    useEffect(() => {
        setTimeout(() => {
            setData(myData);
        }, 400);
    }, []);
    return (
        <>
            <Head>
                <title>Braineet</title>
            </Head>
            <div>
                <MyHome data={data} setData={setData} />
            </div>
        </>
    );
};

Home.getLayout = page => <div>{page}</div>;
Home.getInitialProps = async () => {
    return {};
};

Home.propTypes = {};

Home.defaultProps = {
    theme: {},
};

export default Home;
