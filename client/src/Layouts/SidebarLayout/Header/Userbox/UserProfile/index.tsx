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
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import { EditFullNameSchema, PasswordFormSchema, editFullNameSchema, passwordFormSchema } from 'src/schema/userSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MuiDialog from 'src/components/MuiDialog/MuiDialog';

const userCurrentDefault: UserType = {
    id: '',
    fullName: '',
    userName: '',
    email: '',
    role: 'employee',
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
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [userCurrent, setUserCurrent] = useState({ ...userCurrentDefault });

    const [helperTextStatus, setHelperTextStatus] = useState({ ...helperTextStatusS });

    const [helperTextStr, setHelperTextStr] = useState({ ...helperTextStrS });

    useEffect(() => {
        if (profile) setUserCurrent(profile);
    }, [profile]);

    const handleEditDialogOpen = () => {
        setOpenEdit(true);
    };

    const handleEditDialogClose = () => {
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

    const resetPasswordForm = () => {
        setCurrentPassword('');
        resetPassword();
    };

    const validateOnce = (nameInput: string) => {
        let textCheck = '';

        if (nameInput === 'currentPassword') {
            if (currentPassword === null || currentPassword === '') {
                textCheck = 'The full name field is required';
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

        setHelperTextStatus(helperTextStatus2);
        setHelperTextStr(helperTextStr2);
        return checkValidate;
    };

    const handleEditSubmit = (formValues: EditFullNameSchema) => {
        const id = userCurrent.id;
        const data = {
            fullName: formValues.fullName
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
    };

    const handleEditPasswordSubmit = (formValues: PasswordFormSchema) => {
        if (validateOnSubmitPassword() || !currentPassword) {
            const id = userCurrent.id;
            const data = {
                password: formValues.password
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

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    const {
        handleSubmit: handleSubmitEdit,
        control: controlEdit,
        reset: resetEdit
    } = useForm<EditFullNameSchema>({
        mode: 'onSubmit',
        resolver: yupResolver<EditFullNameSchema>(editFullNameSchema),
        defaultValues: {
            fullName: userCurrent.fullName
        }
    });

    const {
        handleSubmit: handleSubmitPassword,
        control: controlPassword,
        reset: resetPassword
    } = useForm<PasswordFormSchema>({
        mode: 'onSubmit',
        resolver: yupResolver<PasswordFormSchema>(passwordFormSchema)
    });

    useEffect(() => {
        resetEdit(userCurrent);
    }, [userCurrent]);

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
                <Box sx={{ width: '100%' }} ml={1.5}>
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
            <List disablePadding sx={{ my: 1.5 }}>
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
                <Divider sx={{ mb: 3 }} />
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
            <MuiDialog
                title='Edit profile'
                subTitle=''
                fullWidth
                maxWidth='sm'
                open={openEdit}
                handleClose={handleEditDialogClose}
            >
                <form noValidate onSubmit={handleSubmitEdit(handleEditSubmit, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <MuiTextField label='Full name' name='fullName' control={controlEdit} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button color='secondary' onClick={handleEditDialogClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
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
            </MuiDialog>

            <MuiDialog
                title='Change password'
                subTitle='Your password has not been set, please create a new password'
                open={openEditPassword}
                handleClose={handleEditPasswordClose}
            >
                <form noValidate onSubmit={handleSubmitPassword(handleEditPasswordSubmit, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    {currentPassword && (
                                        <Grid item xs={12} md={12}>
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
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='New password'
                                            name='password'
                                            control={controlPassword}
                                            autoComplete='on'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='Confirm New password'
                                            name='passwordConfirm'
                                            control={controlPassword}
                                            autoComplete='on'
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button color='secondary' onClick={handleEditPasswordClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
                            {'Save'}
                        </Button>
                    </DialogActions>
                </form>
            </MuiDialog>
        </>
    );
}

export default Profile;
