import { useGoogleLogin } from '@react-oauth/google';
import { Grid, Button, DialogActions, DialogContent } from '@mui/material';
import axios from 'axios';
import GoogleIcon from 'src/components/Icons/GoogleIcon';
import AuthApi from 'src/apis/auth.api';
import { useContext, useState } from 'react';
import { AppContext } from 'src/contexts/app.context';
import { setProfileToLS } from 'src/utils/auth';
import { notistackError, notistackSuccess } from '../Notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import paths from 'src/utils/paths';
import MuiDialog from '../MuiDialog/MuiDialog';
import MuiTextField from '../MuiTextField/MuiTextField';
import { RegisterByGoogleSchema, registerByGoogleSchema } from 'src/schema/authSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserType } from 'src/types/UserType';

type FormData = RegisterByGoogleSchema;

const GoogleLoginButton = () => {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const navigate = useNavigate();

    const [openGoogleRegister, setOpenGoogleRegister] = useState<boolean>(false);
    const [googleEmail, setGoogleEmail] = useState<string>('');

    const handleGoogleRegisterClose = () => {
        setOpenGoogleRegister(false);
        reset();
    };

    const { handleSubmit, control, reset } = useForm<FormData>({
        mode: 'onSubmit',
        resolver: yupResolver<FormData>(registerByGoogleSchema),
        defaultValues: {
            fullName: '',
            userName: ''
        }
    });

    const handleGoogleRegisterOpen = (response: any) => {
        const formDefault = {
            fullName: response.name,
            userName: ''
        };
        reset(formDefault);
        setGoogleEmail(response.email);
        setOpenGoogleRegister(true);
    };

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`
                    }
                });

                await AuthApi.loginGoogle(res.data)
                    .then((res2) => {
                        if (res2.check) {
                            setIsAuthenticated(true);
                            setProfile(res2.data);
                            setProfileToLS(res2.data);
                            notistackSuccess(res2.message);
                            navigate(paths.home);
                        } else {
                            handleGoogleRegisterOpen(res.data);
                        }
                    })
                    .catch((e: Error) => {
                        console.log(e);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    });

    const loginClick = () => {
        login();
    };

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    const handleFormSubmit = async (formValues: FormData) => {
        const data: UserType = { ...formValues, email: googleEmail, role: 'employee', status: 'active', password: '' };

        await AuthApi.registerGoogle(data)
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

        handleGoogleRegisterClose();
    };

    return (
        <>
            <Button
                fullWidth
                size='medium'
                aria-label='close'
                variant='outlined'
                startIcon={<GoogleIcon />}
                onClick={loginClick}
            >
                Login with Google
            </Button>
            <MuiDialog
                open={openGoogleRegister}
                handleClose={handleGoogleRegisterClose}
                title='Login with google'
                subTitle='Your account has not been registered, please enter the form to complete the registration'
            >
                <form noValidate onSubmit={handleSubmit(handleFormSubmit, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <MuiTextField label='Full name' name='fullName' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <MuiTextField label='Username' name='userName' control={control} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button color='secondary' onClick={handleGoogleRegisterClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
                            {'Register'}
                        </Button>
                    </DialogActions>
                </form>
            </MuiDialog>
        </>
    );
};

export default GoogleLoginButton;
