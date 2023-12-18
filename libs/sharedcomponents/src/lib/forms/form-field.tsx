import { Stack } from '@mui/material';
import React, { HTMLAttributes } from 'react';
import { FormLabel } from './form-label';

interface IFormFieldProps extends HTMLAttributes<HTMLDivElement> {
    /** Form input element */
    children: React.ReactElement;
    /** Text label or custom component */
    label?: string | JSX.Element;
    labelOrientation?: 'vertical' | 'horizontal';
    /** Unique id associated with the input component */
    htmlFor: string;
}

function FormField(props: IFormFieldProps) {
    const { label, labelOrientation = 'vertical', htmlFor, children, ...htmlProps } = props;

    return (
        <Stack
            direction={labelOrientation === 'horizontal' ? 'row' : 'column'}
            alignItems={labelOrientation === 'horizontal' ? 'center' : undefined}
            spacing={0.5}
            {...htmlProps}
        >
            <FormLabel htmlFor={htmlFor}>{label}</FormLabel>
            <div>{children}</div>
        </Stack>
    );
}

export { FormField };
