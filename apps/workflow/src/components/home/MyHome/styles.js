import styled from 'styled-components';

/* DO NOT TOUCH TO THIS CONTAINER */
export const Container = styled.div`
    width: 400px;
    height: 200px;
    overflow: hidden;
`;

/* END OF DO NOT TOUCH */

export const LabelStyled = styled.label`
    font-weight: 600px;
    font-size: 16px;
`;
export const InputBar = styled.input`
    width: 400px;
    padding: 5px;
    border: none;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    margin: 8px 32px;
    box-sizing: border-box;
    height: 36px;
    font-size: 16px;
    outline: none;

    &:focus {
        background: rgba(0, 0, 0, 0.1);
        border: none;
    }
`;

export const Title = styled.h1`
    padding: 5px;
    width: 100%;
    font-size: 24px;
    background: rgba(0, 0, 0, 0.04);
    margin-bottom: 16px;
`;

export const MyContainer = styled.div``;

export const ButtonStyled = styled.button`
    border: none !important;
    padding: 10px;
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    &:hover {
        background: rgba(0, 0, 0, 0.2);
    }
`;

export const SubMenu = styled.div`
    width: 400px;
    height: 200px;
    position: relative;
    z-index: 10;
    background: rgba(0, 0, 0, 0.2);
    text-align: left;
    padding: 8px;
    margin-top: 8px;
    border-radius: 16px;
    top: 8px;
    color: black;
`;

export default {};
