import { Button, Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { UserType } from 'src/types/UserType';
import { registerSchema, RegisterSchema } from 'src/schema/authSchema';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import AuthApi from 'src/apis/auth.api';
import { notistackError, notistackSuccess } from 'src/components/Notistack';

type FormData = RegisterSchema;

function RegisterForm2() {
    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver<RegisterSchema>(registerSchema)
    });

    const handleFormSubmit = async (formValues: RegisterSchema) => {
        const data: UserType = { ...formValues, role: 'employee', status: 'active' };

        await AuthApi.register(data)
            .then((res) => {
                if (res.check) {
                    notistackSuccess(res.message);
                } else {
                    notistackError(res.message);
                }
                return res;
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    return (
        <>
            <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <MuiTextField label='Full name' name='fullName' control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiTextField label='Username' name='userName' control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiTextField label='Email' name='email' control={control} />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiTextField
                            type='password'
                            label='Password'
                            name='password'
                            control={control}
                            autoComplete='on'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MuiTextField
                            type='password'
                            label='Confirm password'
                            name='passwordConfirm'
                            control={control}
                            autoComplete='on'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            sx={{
                                mt: 3
                            }}
                            type='submit'
                            color='primary'
                            fullWidth
                            size='large'
                            variant='contained'
                        >
                            {'Sign up'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
}

export default RegisterForm2;
