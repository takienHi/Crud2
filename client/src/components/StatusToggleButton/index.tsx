import { ToggleButton, ToggleButtonGroup, type ToggleButtonGroupProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';

type statusValue = {
    title: string;
    value: string;
};

type ToggleButtonType = {
    name: string;
    control: Control<any>;
    statusValues: statusValue[];
} & ToggleButtonGroupProps;

function StatusToggleButton({ name, control, statusValues }: ToggleButtonType) {
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    // const { onChange, onBlur, value, ref } = field;

                    return (
                        <ToggleButtonGroup
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'auto auto auto auto',
                                padding: '10px'
                            }}
                            {...field}
                            value={field.value}
                            onChange={(event: React.MouseEvent<HTMLElement>, value: string) => {
                                if (value) field.onChange(value);
                            }}
                            exclusive
                            aria-label='text alignment'
                        >
                            <ToggleButton
                                sx={{
                                    '&.Mui-selected': { backgroundColor: '#57ca22' },
                                    '&:hover': { color: '#62ce31', backgroundColor: '#eefae8' },
                                    '&.Mui-selected:hover': { backgroundColor: 'rgb(69, 161, 27)' },
                                    transition: 'background-color 0.5s ease',
                                    color: '#62ce31',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize',
                                    borderRadius: '10xp !important'
                                }}
                                value={statusValues[0].value}
                                onChange={field.onChange}
                            >
                                {statusValues[0].title}
                            </ToggleButton>
                            <ToggleButton
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#ff1943',
                                        transition: 'background-color 1s ease-in'
                                    },
                                    '&:hover': { color: '#ff1943', backgroundColor: '#ffe8ec' },
                                    '&.Mui-selected:hover': { backgroundColor: 'rgb(204, 20, 53)' },
                                    transition: 'background-color 0.5s ease',
                                    color: '#ff1943',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize'
                                }}
                                value={statusValues[1].value}
                                onChange={field.onChange}
                            >
                                {statusValues[1].title}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    );
                }}
            />
        </>
    );
}

export default StatusToggleButton;
