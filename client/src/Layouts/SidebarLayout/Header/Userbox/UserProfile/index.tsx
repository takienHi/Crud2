import {
    Box,
    Typography,
    Link,
    Badge,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Button,
    Divider,
    useTheme,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
    IconButton
} from '@mui/material';

import { UserType } from 'src/types/UserType';
import Label from 'src/components/Label';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/contexts/app.context';
import CloseIcon from '@mui/icons-material/Close';
import UserApi from 'src/apis/user.api';
import { setProfileToLS } from 'src/utils/auth';
import { notistackSuccess } from 'src/components/Notistack';

const userCurrentDefault: UserType = {
    id: '',
    fullName: '',
    userName: '',
    email: '',
    role: '',
    password: '',
    status: 'active'
};
const helperTextStatusS = {
    fullName: false,
    userName: false,
    email: false,
    password: false,
    passwordConfirm: false,
    currentPassword: false
};

const helperTextStrS = {
    fullName: '',
    userName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    currentPassword: ''
};

function Profile() {
    const { profile, setProfile, setIsAuthenticated } = useContext(AppContext);

    const theme = useTheme();
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openEditPassword, setOpenEditPassword] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [userCurrent, setUserCurrent] = useState({ ...userCurrentDefault });

    const [helperTextStatus, setHelperTextStatus] = useState({ ...helperTextStatusS });

    const [helperTextStr, setHelperTextStr] = useState({ ...helperTextStrS });

    useEffect(() => {
        if (profile) setUserCurrent(profile);
    }, []);
    const handleEditDialogOpen = () => {
        setFullName(userCurrent.fullName ? userCurrent.fullName : '');
        setOpenEdit(true);
    };

    const handleEditDialogClose = () => {
        resetForm();
        setHelperTextStr({ ...helperTextStrS });
        setHelperTextStatus({ ...helperTextStatusS });
        setOpenEdit(false);
    };

    const handleEditPasswordOpen = () => {
        setOpenEditPassword(true);
    };

    const handleEditPasswordClose = () => {
        setHelperTextStr({ ...helperTextStrS });
        setHelperTextStatus({ ...helperTextStatusS });
        resetPasswordForm();
        setOpenEditPassword(false);
    };

    const handleEditUserOpen = () => {
        handleEditDialogOpen();
    };

    const resetForm = () => {
        setFullName('');
    };

    const resetPasswordForm = () => {
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirm('');
    };

    const validateOnce = (nameInput: string) => {
        let textCheck = '';

        if (nameInput === 'fullName') {
            if (fullName === null || fullName === '') {
                textCheck = 'The full name field is required';
            }
        }

        if (nameInput === 'currentPassword') {
            if (currentPassword === null || currentPassword === '') {
                textCheck = 'The full name field is required';
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

    const onChangeFullName = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());
        setFullName(e.target.value);
    };

    const validateOnSubmitPassword = () => {
        let checkValidate = true;

        const helperTextStatus2 = {
            fullName: false,
            userName: false,
            email: false,
            password: false,
            passwordConfirm: false,
            currentPassword: false
        };

        const helperTextStr2 = {
            fullName: '',
            userName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            currentPassword: ''
        };

        if (currentPassword === null || currentPassword === '') {
            checkValidate = false;
            helperTextStatus2.currentPassword = true;
            helperTextStr2.currentPassword = 'The password field is required';
        } else if (currentPassword !== userCurrent.password) {
            checkValidate = false;
            helperTextStatus2.currentPassword = true;
            helperTextStr2.currentPassword = 'The password is not the same as the current password';
        }

        if (password === null || password === '') {
            checkValidate = false;
            helperTextStatus2.password = true;
            helperTextStr2.password = 'The password field is required';
        }

        if (passwordConfirm !== password) {
            checkValidate = false;
            helperTextStatus2.passwordConfirm = true;
            helperTextStr2.passwordConfirm = 'Confirm password is incorrect';
        }

        console.log('helperTextStatus2:', helperTextStatus2);

        setHelperTextStatus(helperTextStatus2);
        setHelperTextStr(helperTextStr2);
        return checkValidate;
    };

    const validateOnSubmitEdit = () => {
        let checkValidate = true;

        const helperTextStatus2 = {
            fullName: false,
            userName: false,
            email: false,
            password: false,
            passwordConfirm: false,
            currentPassword: false
        };

        const helperTextStr2 = {
            fullName: '',
            userName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            currentPassword: ''
        };

        if (fullName === null || fullName === '') {
            checkValidate = false;
            helperTextStatus2.fullName = true;
            helperTextStr2.fullName = 'The fullName field is required';
        }

        console.log('helperTextStatus2:', helperTextStatus2);

        setHelperTextStatus(helperTextStatus2);
        setHelperTextStr(helperTextStr2);
        return checkValidate;
    };

    const handleEditSubmit = () => {
        if (validateOnSubmitEdit()) {
            const id = userCurrent.id;
            const data = {
                fullName: fullName
            };
            UserApi.update2(id, data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .then((response: any) => {
                    if (response.data !== undefined) {
                        const newUser = response.data;
                        setIsAuthenticated(true);
                        setProfile(newUser);
                        setProfileToLS(newUser);
                        notistackSuccess('The user has been updated');
                    }
                })
                .catch((e: Error) => {
                    console.log(e);
                });
            handleEditDialogClose();
        }
    };

    const handleEditPasswordSubmit = () => {
        if (validateOnSubmitPassword()) {
            const id = userCurrent.id;
            const data = {
                password: password
            };
            UserApi.update2(id, data)
                .then((response: any) => {
                    if (response.data !== undefined) {
                        const newUser = response.data;
                        setIsAuthenticated(true);
                        setProfile(newUser);
                        setProfileToLS(newUser);
                        notistackSuccess('The password has been updated');
                    }
                })
                .catch((e: Error) => {
                    console.log(e);
                });
            handleEditPasswordClose();

            handleEditDialogClose();
        }
    };

    const onChangeCurrentPassword = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setCurrentPassword(e.target.value);
    };

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setPassword(e.target.value);
    };

    const onChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>): void => {
        onErrorOff(e.target.name.toString());

        setPasswordConfirm(e.target.value);
    };

    return (
        <>
            <Box mb={2} display='flex' alignItems='center'>
                <Badge color='success' overlap='rectangular'>
                    <Avatar
                        variant='rounded'
                        sx={{
                            fontSize: `${theme.typography.pxToRem(16)}`,
                            background: `${theme.colors.alpha.black[100]}`,
                            color: `${theme.palette.getContrastText(theme.colors.alpha.black[100])}`,
                            borderRadius: `${theme.general.borderRadiusSm}`,
                            width: 95,
                            height: 95
                        }}
                    >
                        {userCurrent.userName}
                    </Avatar>
                </Badge>
                <Box
                    sx={{
                        width: '100%'
                    }}
                    ml={1.5}
                >
                    <Link
                        href='#'
                        color='text.primary'
                        underline='none'
                        sx={{
                            transition: `${theme.transitions.create(['color'])}`,
                            fontSize: `${theme.typography.pxToRem(17)}`,

                            '&:hover': {
                                color: `${theme.colors.primary.main}`
                            }
                        }}
                        variant='h4'
                    >
                        {userCurrent.fullName}
                    </Link>
                    <Typography gutterBottom variant='subtitle2'>
                        {userCurrent.role}
                    </Typography>
                </Box>
            </Box>
            <List
                disablePadding
                sx={{
                    my: 1.5
                }}
            >
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'UserName'}:`}
                    />
                    <Typography variant='subtitle1'>{userCurrent.userName}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'Email'}:`}
                    />
                    <Typography variant='subtitle1'>{userCurrent.email}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'Status'}:`}
                    />
                    <Typography variant='subtitle1'>
                        {userCurrent.status === 'active' ? (
                            <Label color='success'>Active</Label>
                        ) : (
                            <Label color='error'>Disabled</Label>
                        )}
                    </Typography>
                </ListItem>
                <Divider
                    sx={{
                        mb: 3
                    }}
                />
                <Button
                    onClick={() => handleEditUserOpen()}
                    variant='contained'
                    sx={{
                        width: '45%',
                        textTransform: 'capitalize',
                        ml: '2.5%',
                        mr: '5%'
                    }}
                >
                    {'Edit profile'}
                </Button>
                <Button
                    onClick={() => handleEditPasswordOpen()}
                    variant='contained'
                    sx={{
                        width: '45%',
                        textTransform: 'capitalize',
                        mr: '2.5%'
                    }}
                >
                    {'Change password'}
                </Button>
            </List>
            <Dialog fullWidth maxWidth='sm' open={openEdit} onClose={handleEditDialogClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Edit user'}
                    </Typography>
                </DialogTitle>
                <form>
                    <DialogContent
                        dividers
                        sx={{
                            p: 3
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3
                        }}
                    >
                        <Button color='secondary' onClick={handleEditDialogClose}>
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleEditSubmit} variant='contained'>
                            {'Save'}
                        </Button>
                    </DialogActions>
                </form>
                <IconButton
                    aria-label='close'
                    onClick={handleEditDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Dialog>
            <Dialog fullWidth maxWidth='sm' open={openEditPassword} onClose={handleEditPasswordClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Edit user password'}
                    </Typography>
                </DialogTitle>
                <form>
                    <DialogContent
                        dividers
                        sx={{
                            p: 3
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            error={helperTextStatus.currentPassword}
                                            label={'Current Password'}
                                            name='currentPassword'
                                            onBlur={handleBlur}
                                            onChange={onChangeCurrentPassword}
                                            type='password'
                                            value={currentPassword}
                                            helperText={helperTextStr.currentPassword}
                                            variant='outlined'
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3
                        }}
                    >
                        <Button color='secondary' onClick={handleEditPasswordClose}>
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleEditPasswordSubmit} variant='contained'>
                            {'Save'}
                        </Button>
                    </DialogActions>
                </form>
                <IconButton
                    aria-label='close'
                    onClick={handleEditPasswordClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Dialog>
        </>
    );
}

export default Profile;
