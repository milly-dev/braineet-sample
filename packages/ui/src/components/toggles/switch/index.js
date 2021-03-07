import React from 'react';
import PropTypes from 'prop-types';
import { CheckBoxWrapper, CheckBoxLabel, CheckBox } from './styles';

/**
 * The `Toggle` component.
 */

export const Switch = props => {
    const { disabled } = props;
    const { label } = props;

    return (
        <div>
            <CheckBoxWrapper>
                {disabled === true ? (
                    <CheckBox id="checkbox" type="checkbox" disabled />
                ) : (
                    <CheckBox id="checkbox" type="checkbox" />
                )}
                {label}
                <CheckBoxLabel htmlFor="checkbox" />
            </CheckBoxWrapper>
        </div>
    );
};

Switch.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
};
Switch.defaultProps = {
    disabled: false,
    label: 'This is a label',
};
export default Switch;
