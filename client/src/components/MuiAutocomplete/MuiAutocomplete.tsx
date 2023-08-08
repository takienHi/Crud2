import { Controller, Control, Path, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface MuiAutocompleteProps<O extends { value: string; label: string }, TField extends FieldValues> {
    control: Control<TField>;
    name: Path<TField>;
    options: O[];
    placeholder?: string;
}

const MuiAutocomplete = <O extends { value: string; label: string }, TField extends FieldValues>(
    props: MuiAutocompleteProps<O, TField>
) => {
    const { control, options, name } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => {
                const { onChange, onBlur, value, ref } = field;
                return (
                    <>
                        <Autocomplete
                            value={
                                value
                                    ? options.find((option) => {
                                          return value === option.value;
                                      }) ?? null
                                    : null
                            }
                            getOptionLabel={(option) => {
                                return option.label;
                            }}
                            onChange={(event: any, newValue) => {
                                onChange(newValue ? newValue.value : null);
                            }}
                            options={options}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={props.placeholder}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    error={invalid}
                                    helperText={error?.message}
                                    inputRef={ref}
                                    fullWidth
                                    variant='outlined'
                                />
                            )}
                        />
                    </>
                );
            }}
        />
    );
};
export default MuiAutocomplete;
