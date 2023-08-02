import { Button, TextField, Grid } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import UserApi from 'src/apis/user.api';
import { notistackSuccess } from 'src/components/Notistack';
import { UserType } from 'src/types/UserType';
import paths from 'src/utils/paths';

const LoginForm = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [helperTextStatus, setHelperTextStatus] = useState({
        fullName: false,
        userName: false,
        email: false,
        password: false,
        passwordConfirm: false
    });

    const [helperTextStr, setHelperTextStr] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const resetForm = () => {
        setFullName('');
        setUserName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    };

    const validateForm = async () => {
        let checkValidate = true;

        const helperTextStatusS = {
            fullName: false,
            userName: false,
            email: false,
            password: false,
            passwordConfirm: false
        };

        const helperTextStrS = {
            fullName: '',
            userName: '',
            email: '',
            password: '',
            passwordConfirm: ''
        };

        if (fullName === null || fullName === '') {
            checkValidate = false;
            helperTextStatusS.fullName = true;
            helperTextStrS.fullName = 'The full name field is required';
        }

        if (userName === null || userName === '') {
            checkValidate = false;
            helperTextStatusS.userName = true;
            helperTextStrS.userName = 'The userName field is required';
        } else if (await UserApi.checkUserNameUnique(userName)) {
            checkValidate = false;
            helperTextStatusS.userName = true;
            helperTextStrS.userName = 'The userName already exists';
        }

        if (email === null || email === '') {
            checkValidate = false;
            helperTextStatusS.email = true;
            helperTextStrS.email = 'The email field is required';
        } else if (await UserApi.checkEmailUnique(email)) {
            checkValidate = false;
            helperTextStatusS.email = true;
            helperTextStrS.email = 'The email already exists';
        }

        if (password === null || password === '') {
            checkValidate = false;
            helperTextStatusS.password = true;
            helperTextStrS.password = 'The password field is required';
        }

        if (passwordConfirm !== password) {
            checkValidate = false;
            helperTextStatusS.passwordConfirm = true;
            helperTextStrS.passwordConfirm = 'Confirm password is incorrect';
        }

        setHelperTextStatus(helperTextStatusS);
        setHelperTextStr(helperTextStrS);
        return checkValidate;
    };

    const handleSubmit = async () => {
        // setOnHelperText(true);
        if (await validateForm()) {
            const data: UserType = {
                id: '',
                fullName: fullName,
                userName: userName,
                email: email,
                role: 'employee',
                password: password,
                status: 'active'
            };

            UserApi.create(data)
                .then(() => {
                    resetForm();
                    notistackSuccess('Successful account registration, now login your account!');
                    navigate(paths.login);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
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

    const onChangeFullName = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());
        setFullName(e.target.value);
    };

    const onChangeUserName = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setUserName(e.target.value);
    };

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setEmail(e.target.value);
    };
    const onChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setPassword(e.target.value);
    };
    const onChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setPasswordConfirm(e.target.value);
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

    const validateOnce = (nameInput: string) => {
        let textCheck = '';

        if (nameInput === 'fullName') {
            if (fullName === null || fullName === '') {
                textCheck = 'The full name field is required';
            }
        }
        if (nameInput === 'userName') {
            if (userName === null || userName === '') {
                textCheck = 'The userName field is required';
            }
        }

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

        if (nameInput === 'passwordConfirm') {
            if (passwordConfirm !== password) {
                textCheck = 'Confirm password is incorrect';
            }
        }
        return textCheck;
    };

    return (
        <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        error={helperTextStatus.fullName}
                        label={'Full name'}
                        name='fullName'
                        onBlur={handleBlur}
                        onChange={onChangeFullName}
                        value={fullName}
                        helperText={helperTextStr.fullName}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        error={helperTextStatus.userName}
                        label={'Username'}
                        name='userName'
                        onBlur={handleBlur}
                        onChange={onChangeUserName}
                        value={userName}
                        helperText={helperTextStr.userName}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        error={helperTextStatus.email}
                        label={'Email address'}
                        name='email'
                        onBlur={handleBlur}
                        onChange={onChangeEmail}
                        type='email'
                        value={email}
                        helperText={helperTextStr.email}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        error={helperTextStatus.password}
                        label={'Password'}
                        name='password'
                        onBlur={handleBlur}
                        onChange={onChangePassword}
                        type='password'
                        value={password}
                        helperText={helperTextStr.password}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        fullWidth
                        error={helperTextStatus.passwordConfirm}
                        label={'Confirm password'}
                        name='passwordConfirm'
                        onBlur={handleBlur}
                        onChange={onChangePasswordConfirm}
                        type='password'
                        value={passwordConfirm}
                        helperText={helperTextStr.passwordConfirm}
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Button
                        sx={{
                            mt: 3
                        }}
                        color='primary'
                        onClick={handleSubmit}
                        fullWidth
                        size='large'
                        variant='contained'
                    >
                        {'Sign up'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;
