/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    ButtonStyled,
    Container,
    InputBar,
    LabelStyled,
    MyContainer,
    SubMenu,
    Title,
} from './styles';

const MyHome = ({ data }) => {
    const [openModal, setOpenModal] = useState(false);

    const change = e => {
        data.title = e.target.value;
    };
    return (
        <>
            <LabelStyled htmlFor="myTitle">Choose your title</LabelStyled>
            <InputBar
                id="myTitle"
                value={data.data.getProject.title}
                onChange={change}
            />
            <Container>
                <Title>{data.data.getProject.title}</Title>
                <MyContainer>
                    <ButtonStyled onClick={() => setOpenModal(!openModal)}>
                        {openModal ? 'Open the modal' : 'Close the modal'}
                    </ButtonStyled>
                    {openModal ? (
                        <SubMenu>
                            <ul>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                                <li>This is the sub menu</li>
                            </ul>
                        </SubMenu>
                    ) : null}
                </MyContainer>
            </Container>
        </>
    );
};

MyHome.propTypes = {
    data: PropTypes.object.isRequired,
};

export default MyHome;
