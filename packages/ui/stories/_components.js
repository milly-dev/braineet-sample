/* eslint-disable react/prop-types */

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 0px 20px;
`;

export const Page = ({ children }) => <Container>{children}</Container>;

export default {
    Page,
};
