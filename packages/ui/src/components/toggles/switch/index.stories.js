import React, { useState } from 'react';
import Switch from '.';

export default {
    title: 'Data entry/Switch',
    component: Switch,
};

export const Default = args => {
    const [value, setValue] = useState(false);
    const onChange = e => {
        setValue(e.target.checked);
    };
    return (
        <div>
            <Switch name="test" value={value} {...args} onChange={onChange} />
        </div>
    );
};
Default.argTypes = {
    value: { control: { disable: true } },
};
