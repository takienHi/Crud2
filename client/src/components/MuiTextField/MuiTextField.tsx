import { TextField, type TextFieldProps } from '@mui/material';
import { useState } from 'react';
import { Control, useController } from 'react-hook-form';

type MuiTextFieldType = {
    label?: string;
    name: string;
    control: Control<any>;
} & TextFieldProps;

function MuiTextField({ label, name, control, ...otherProps }: MuiTextFieldType) {
    const [showError, setShowError] = useState(true);
    const {
        field: { value, onBlur, onChange, ref },
        fieldState: { invalid, error }
    } = useController({
        name,
        control
    });

    const onFocusTextField = () => {
        setShowError(false);
    };

    const onBlurTextField = () => {
        onBlur;
        setShowError(true);
    };

    return (
        <>
            <TextField
                label={label}
                name={name}
                value={value || ''}
                onBlur={onBlurTextField}
                onChange={(e) => {
                    onChange(e), onFocusTextField();
                }}
                // onFocus={onFocusTextField}
                error={showError && invalid}
                helperText={showError ? error?.message : ''}
                {...otherProps}
                inputRef={ref}
                fullWidth
                variant='outlined'
            />
        </>
    );
}

export default MuiTextField;
