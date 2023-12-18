import React, { ChangeEvent, ChangeEventHandler, forwardRef, useEffect, useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { TextField } from '@mui/material';
import { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldProps } from '@mui/material/TextField/TextField';
import { FormAPI } from '../../types/forms';
import { LinkGcpAccountForm } from '@vegaplatformui/models';
import { UseFormSetValue } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJsonInputProps extends StandardTextFieldProps {
    onChangeValue: (value: string) => void;
    value: string;
    setFormValue: UseFormSetValue<LinkGcpAccountForm>;
}
const JsonInput = forwardRef(function (props: IJsonInputProps, ref) {
    const { onChangeValue, setFormValue, value, ...remainingProps } = props;
    const { classes, cx } = useStyles(props);
    const [jsonValue, setJsonValue] = useState<string>(props.value);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleParseJson(event.target.value);
    };

    useEffect(() => {
        handleParseJson(value);
    }, []);

    const handleParseJson = (value: string) => {
        try {
            if (value) {
                const parsedJson = JSON.stringify(JSON.parse(value), null, 4);
                setJsonValue(parsedJson);
                onChangeValue(parsedJson);
                setFormValue('service_account', value, {
                    shouldValidate: true, // trigger validation
                    shouldTouch: true, // update touched fields form state
                    shouldDirty: true, // update dirty and dirty fields form state
                });
                setError(null);
            }
        } catch (e) {
            //Going to comment this out for now so that it no longer shows in the console
            //console.error('Invalid JSON');
            setError('Invalid JSON');
            onChangeValue(value);
        }
    };

    return (
        <TextField
            {...remainingProps}
            multiline
            {...ref}
            rows={props.rows || 6}
            variant='outlined'
            value={value}
            onChange={handleInputChange}
            error={props.error ? props.error : !!error}
            helperText={props.helperText ? props.helperText : error}
        />
    );
});

// const JsonInput: React.FC<IJsonInputProps> = (props) => {
//     const { classes, cx } = useStyles(props);
//     const [jsonValue, setJsonValue] = useState<string>(props.value);
//     const [error, setError] = useState<string | null>(null);
//
//     const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         handleParseJson(event.target.value);
//     };
//
//     useEffect(() => {
//         handleParseJson(props.value);
//     }, []);
//
//     const handleParseJson = (value: string) => {
//         try {
//             const parsedJson = JSON.stringify(JSON.parse(value), null, 4);
//             setJsonValue(parsedJson);
//             props.onChangeValue(parsedJson);
//
//             props.setFormValue('service_account', value, {
//                 shouldValidate: true, // trigger validation
//                 shouldTouch: true, // update touched fields form state
//                 shouldDirty: true, // update dirty and dirty fields form state
//             });
//             setError(null);
//         } catch (e) {
//             console.error('Invalid JSON');
//             setError('Invalid JSON');
//             props.onChangeValue(value);
//         }
//     };
//
//     return (
//         <TextField
//             {...props}
//             multiline
//             rows={props.rows || 6}
//             variant='outlined'
//             value={props.value}
//             onChange={handleInputChange}
//             error={props.error ? props.error : !!error}
//             helperText={props.helperText ? props.helperText : error}
//         />
//     );
// };

const useStyles = makeStyles<IJsonInputProps>()((theme, props) => ({}));

export { JsonInput };
