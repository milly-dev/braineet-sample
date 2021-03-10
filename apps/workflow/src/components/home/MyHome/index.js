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
    if (data.data === undefined) {
        return 'error';
    }
    const [openModal, setOpenModal] = useState(false);
    const [title, setTitle] = useState(data.data.getProject.title);

    const change = e => {
        // data.title = e.target.value;
        setTitle(e.target.value);
    };

    return (
        <>
            <LabelStyled htmlFor="myTitle">Choose your title</LabelStyled>
            <InputBar id="myTitle" value={title} onChange={change} />
            <Container>
                <Title>{title}</Title>
                <MyContainer>
                    <ButtonStyled onClick={() => setOpenModal(!openModal)}>
                        {openModal ? 'Open the modal' : 'Close the modal'}
                    </ButtonStyled>
                </MyContainer>
            </Container>
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
        </>
    );
};

MyHome.propTypes = {
    data: PropTypes.object.isRequired,
};

export default MyHome;
