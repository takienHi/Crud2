import * as Yup from 'yup';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    FormHelperText,
    TextField,
    Checkbox,
    Typography,
    Link,
    FormLabel,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import { ChangeEvent, useContext, useState } from 'react';
import AuthApi from 'src/apis/auth.api';
import { AppContext } from 'src/contexts/app.context';
import paths from 'src/utils/paths';
import { setProfileToLS } from 'src/utils/auth';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [helperTextStatus, setHelperTextStatus] = useState({
        email: false,
        password: false
    });

    const [helperTextStr, setHelperTextStr] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log('handleSubmit');
    };

    const validateForm = () => {
        let checkValidate = true;

        const helperTextStatusS = {
            email: false,
            password: false
        };

        const helperTextStrS = {
            email: '',
            password: ''
        };

        if (email === null || email === '') {
            checkValidate = false;
            helperTextStatusS.email = true;
            helperTextStrS.email = 'The email field is required';
        }

        if (password === null || password === '') {
            checkValidate = false;
            helperTextStatusS.password = true;
            helperTextStrS.password = 'The password field is required';
        }

        setHelperTextStatus(helperTextStatusS);
        setHelperTextStr(helperTextStrS);
        return checkValidate;
    };

    const handleSubmitForm = async () => {
        if (validateForm()) {
            await AuthApi.login(email, password)
                .then((response: any) => {
                    if (response.data) {
                        const newUser = response.data[0];
                        setIsAuthenticated(true);
                        setProfile(newUser);
                        setProfileToLS(newUser);
                        navigate(paths.home);
                        toast.success('Login successful', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'colored'
                        });
                    } else {
                        toast.error('Email or password is incorrect', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'colored'
                        });
                    }
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        }
    };

    const validateOnce = (nameInput: string) => {
        let textCheck = '';

        if (nameInput === 'email') {
            if (email === null || email === '') {
                textCheck = 'The email field is required';
            }
        }

        if (nameInput === 'password') {
            if (password === null || password === '') {
                textCheck = 'The password is required';
            }
        }
        return textCheck;
    };
    const handleBlur = (event: any): void => {
        const nameInput = event.target.name;
        const textCheck = validateOnce(nameInput);

        if (textCheck !== null && textCheck !== '') {
            setHelperTextStatus((prev) => ({
                ...prev,
                [nameInput]: true
            }));
            setHelperTextStr((prev) => ({
                ...prev,
                [nameInput]: textCheck
            }));
        } else {
            setHelperTextStatus((prev) => ({
                ...prev,
                [nameInput]: false
            }));
            setHelperTextStr((prev) => ({
                ...prev,
                [nameInput]: textCheck
            }));
        }
    };

    const onErrorOff = (nameInput: string): void => {
        setHelperTextStatus((prev) => ({
            ...prev,
            [nameInput]: false
        }));
        setHelperTextStr((prev) => ({
            ...prev,
            [nameInput]: ''
        }));
    };

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());
        setEmail(e.target.value);
    };

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());
        setPassword(e.target.value);
    };

    return (
        <form noValidate>
            <TextField
                fullWidth
                error={helperTextStatus.email}
                margin='normal'
                label={'Email address'}
                name='email'
                onBlur={handleBlur}
                onChange={onChangeEmail}
                type='email'
                value={email}
                helperText={helperTextStr.email}
                variant='outlined'
            />
            <TextField
                fullWidth
                error={helperTextStatus.password}
                margin='normal'
                label={'Password'}
                name='password'
                onBlur={handleBlur}
                onChange={onChangePassword}
                type='password'
                value={password}
                helperText={helperTextStr.password}
                variant='outlined'
            />

            <Button
                sx={{
                    mt: 3
                }}
                color='primary'
                fullWidth
                size='large'
                variant='contained'
                onClick={handleSubmitForm}
            >
                {'Sign in'}
            </Button>
        </form>
    );
};

export default LoginForm;
