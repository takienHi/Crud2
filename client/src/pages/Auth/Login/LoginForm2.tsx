import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';

import { Button, Grid } from '@mui/material';
import { ChangeEvent, useContext, useState } from 'react';
import AuthApi from 'src/apis/auth.api';
import { AppContext } from 'src/contexts/app.context';
import paths from 'src/utils/paths';
import { setProfileToLS } from 'src/utils/auth';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import { LoginSchema, loginSchema } from 'src/schema/authSchema';
import { notistackError, notistackSuccess } from 'src/components/Notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type FormData = LoginSchema;

const LoginForm = () => {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);

    const { control, handleSubmit } = useForm<FormData>({
        resolver: yupResolver<LoginSchema>(loginSchema)
    });

    const navigate = useNavigate();

    const handleFormSubmit = async (formValues: LoginSchema) => {
        console.log('handleFormSubmit');

        const data: LoginSchema = { ...formValues };

        await AuthApi.login2(data)
            .then((res) => {
                if (res.check) {
                    setIsAuthenticated(true);
                    setProfile(res.data);
                    setProfileToLS(res.data);
                    notistackSuccess(res.message);
                    navigate(paths.home);
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
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <MuiTextField label='Email or Username' name='email' control={control} />
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
                        {'Login'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;
