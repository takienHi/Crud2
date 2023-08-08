import { Helmet } from 'react-helmet-async';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Button, DialogContent, DialogActions } from '@mui/material';
import Footer from 'src/components/Footer';

import { useContext, useEffect, useState } from 'react';
import { UserType } from 'src/types/UserType';
import UserApi from 'src/apis/user.api';
import UserList2 from './UserList2';

import PageHeader from 'src/components/PageHeader';
import MuiDialog from 'src/components/MuiDialog/MuiDialog';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import MuiAutocomplete from 'src/components/MuiAutocomplete/MuiAutocomplete';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateUserSchema, createUserSchema } from 'src/schema/userSchema';
import { notistackSuccess } from 'src/components/Notistack';
import { getRoles } from 'src/data/roles';
import { AppContext } from 'src/contexts/app.context';

type FormData = CreateUserSchema;

function Users() {
    const { profile } = useContext(AppContext);

    const [openCreateDialog, setCreateDialog] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [filterString, setFilterString] = useState<string>('');

    const roles = getRoles(profile ? profile.role : '');

    const createDialogClose = () => {
        reset();
        setCreateDialog(false);
    };

    const createDialogOpen = () => {
        setCreateDialog(true);
    };

    const addUserComplete = () => {
        getUserList();
        createDialogClose();
    };

    const editUserComplete = () => {
        getUserList();
    };

    const getUserList = () => {
        UserApi.getAll(filterString)
            .then((response: any) => {
                setUsers(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const filterStringChanged = (filterStr: string) => {
        setFilterString(filterStr);
    };

    useEffect(() => {
        getUserList();
    }, [filterString]);

    const { handleSubmit, control, reset } = useForm<FormData>({
        mode: 'onSubmit',
        resolver: yupResolver<CreateUserSchema>(createUserSchema)
    });

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    const handleFormSubmit = (formValues: FormData) => {
        const data: UserType = { ...formValues, status: 'active' };

        UserApi.create(data)
            .then(() => {
                notistackSuccess('The new user has been add');
                addUserComplete();
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    return (
        <>
            <Helmet>
                <title>Users</title>
            </Helmet>
            <PageTitleWrapper>
                <PageHeader
                    handleAction={createDialogOpen}
                    title='User Management'
                    subTitle='All aspects related to the app users can be managed from this page'
                    buttonTitle='Create User'
                />
            </PageTitleWrapper>
            <Container maxWidth='lg'>
                <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                    <Grid item xs={12}>
                        <UserList2
                            modelList={users}
                            filterStringChanged={filterStringChanged}
                            editUserComplete={editUserComplete}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            <MuiDialog
                open={openCreateDialog}
                handleClose={createDialogClose}
                title='Add new user'
                subTitle='Fill in the fields below to create and add a new user to the site'
            >
                <form noValidate onSubmit={handleSubmit(handleFormSubmit, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField label='Full name' name='fullName' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiAutocomplete
                                            options={roles}
                                            control={control}
                                            name='role'
                                            placeholder='Choose role'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField label='Username' name='userName' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField label='Email' name='email' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='Password'
                                            name='password'
                                            control={control}
                                            autoComplete='on'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='Confirm password'
                                            name='passwordConfirm'
                                            control={control}
                                            autoComplete='on'
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button color='secondary' onClick={createDialogClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
                            {'Add new user'}
                        </Button>
                    </DialogActions>
                </form>
            </MuiDialog>
        </>
    );
}

export default Users;
