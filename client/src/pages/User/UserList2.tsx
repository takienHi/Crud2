import { FC, ChangeEvent, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Grid,
    Button,
    DialogActions,
    DialogContent
} from '@mui/material';

import Label from 'src/components/Label';

import { UserType, UserStatusType } from 'src/types/UserType';
import UserApi from 'src/apis/user.api';
import { AppContext } from 'src/contexts/app.context';
import UserProfile from './UserProfile';
import { notistackError, notistackSuccess } from 'src/components/Notistack';
import MuiDialog from 'src/components/MuiDialog/MuiDialog';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditUserSchema, PasswordFormSchema, editUserSchema, passwordFormSchema } from 'src/schema/userSchema';
import MuiReadOnlyTextField from 'src/components/MuiReadOnlyTextField';
import StatusToggleButton from 'src/components/StatusToggleButton';
import TableFilterUser from '../components/TableFilter/TableFilterUser';

import TableActions from '../components/TableActions';
import TableTypography from 'src/components/TableTypography';
import MuiAutocomplete from 'src/components/MuiAutocomplete/MuiAutocomplete';
import { getRoles } from 'src/data/roles';

interface RecentOrdersTableProps {
    className?: string;
    modelList: UserType[];
    filterStringChanged: (filterStr: string) => void;
    editUserComplete: () => void;
}

interface Filters {
    status?: any;
    role?: any;
    searchStr?: any;
}

const statusOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'active',
        name: 'Active'
    },
    {
        id: 'disabled',
        name: 'Disabled'
    }
];

const roleOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'manager',
        name: 'Manager'
    },
    {
        id: 'employee',
        name: 'Employee'
    }
];

const getStatusLabel = (userStatus: UserStatusType): JSX.Element => {
    const map = {
        disabled: {
            text: 'Disabled',
            color: 'error'
        },
        active: {
            text: 'Active',
            color: 'success'
        }
    };

    const { text, color }: any = map[userStatus];

    return <Label color={color}>{text}</Label>;
};

const statusValues = [
    {
        title: 'Active',
        value: 'active'
    },
    {
        title: 'Disabled',
        value: 'disabled'
    }
];

const filterString = (filters: Filters): string => {
    let filterStr = '';

    if (filters.searchStr) {
        filterStr = filterStr + 'q=' + filters.searchStr + '&';
    }

    if (filters.status && filters.status !== 'all') {
        filterStr = filterStr + 'status=' + filters.status + '&';
    }

    if (filters.role && filters.role !== 'all') {
        filterStr = filterStr + 'role=' + filters.role + '&';
    }

    return filterStr;
};

const applyPagination = (modelList: UserType[], page: number, limit: number): UserType[] => {
    return modelList.slice(page * limit, page * limit + limit);
};

const UserList2: FC<RecentOrdersTableProps> = ({ modelList, filterStringChanged, editUserComplete }) => {
    const { profile } = useContext(AppContext);

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState({
        role: null,
        status: null,
        searchStr: ''
    });

    const userCurrentDefault: UserType = {
        id: '',
        fullName: '',
        userName: '',
        email: '',
        role: 'employee',
        password: '',
        status: 'active'
    };

    const roles = getRoles(profile ? profile.role : '');

    const paginatedCryptoOrders = applyPagination(modelList, page, limit);
    const [userCurrent, setUserCurrent] = useState<UserType>(userCurrentDefault);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [openEditPassword, setOpenEditPassword] = useState<boolean>(false);

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleStatusChange = (e: any) => {
        let value: any = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
    };

    const handleRoleChange = (e: any) => {
        let value: any = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            role: value
        }));
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const handleSearchStrChange = (e: any) => {
        let value: any = '';

        if (e.target.value && e.target.value !== '') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            searchStr: value
        }));
    };

    useEffect(() => {
        filterStringChanged(filterString(filters));
        setPage(0);
    }, [filters]);

    const handleEditDialogOpen = () => {
        setOpenEdit(true);
    };

    const handleEditDialogClose = () => {
        reset();
        setOpenEdit(false);
    };

    const handleEditPasswordOpen = () => {
        setOpenEditPassword(true);
    };

    const handleEditPasswordClose = () => {
        resetPassword();
        setOpenEditPassword(false);
    };

    const handleViewUserClose = () => {
        setUserCurrent(userCurrentDefault);
        setOpenView(false);
    };

    const handleViewUserOpen = (model: UserType) => {
        setUserCurrent(model);

        setOpenView(true);
    };

    const handleEditUserOpen = (model: UserType) => {
        if (model.id !== undefined) {
            setUserCurrent(model);
            handleEditDialogOpen();
        } else {
            notistackError('This user could not be found ');
        }
    };

    // const onChangeStatusUser = (e: any) => {
    //     console.log('onChangeStatusUser');

    //     setValue('status', e.target.value, {
    //         shouldValidate: true,
    //         shouldDirty: true
    //     });
    //     console.log(getValues('status'));
    // };

    const handleEditSubmit2 = (formValues: EditUserSchema) => {
        const id = userCurrent.id;
        const data = {
            fullName: formValues.fullName,
            role: formValues.role,
            status: formValues.status
        };
        UserApi.update2(id, data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((_response: any) => {
                setUserCurrent(userCurrentDefault);
                editUserComplete();
                notistackSuccess('The user has been updated');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        handleEditDialogClose();
    };

    const handleEditPasswordSubmit2 = (formValues: PasswordFormSchema) => {
        const id = userCurrent.id;
        const data = {
            password: formValues.password
        };

        UserApi.update2(id, data)
            .then((response: any) => {
                setUserCurrent(userCurrentDefault);
                console.log('response: ', response.data);
                editUserComplete();
            })
            .catch((e: Error) => {
                console.log(e);
            });
        handleEditPasswordClose();
        handleEditDialogClose();
    };

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    const { handleSubmit, control, reset } = useForm<EditUserSchema>({
        mode: 'onSubmit',
        resolver: yupResolver<EditUserSchema>(editUserSchema)
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
        reset(userCurrent);
    }, [userCurrent]);

    return (
        <>
            <TableFilterUser
                filters={filters}
                statusOptions={statusOptions}
                roleOptions={roleOptions}
                handleSearchStrChange={handleSearchStrChange}
                handleStatusChange={handleStatusChange}
                handleRoleChange={handleRoleChange}
            />
            <Card sx={{ p: 1, mb: 3 }}>
                <TableContainer>
                    <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '5%' }}>#</TableCell>
                                <TableCell>Full name</TableCell>
                                <TableCell>User name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell sx={{ width: '10%' }}>Role</TableCell>
                                <TableCell sx={{ width: '10%' }} align='right'>
                                    Status
                                </TableCell>
                                <TableCell sx={{ width: '15%' }} align='center'>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCryptoOrders.map((model, index) => {
                                return (
                                    <TableRow hover key={model.id}>
                                        <TableCell>
                                            <TableTypography>{limit * page + index + 1}</TableTypography>
                                        </TableCell>
                                        <TableCell>
                                            <TableTypography>{model.fullName}</TableTypography>
                                        </TableCell>
                                        <TableCell>
                                            <TableTypography>{model.userName}</TableTypography>
                                        </TableCell>
                                        <TableCell>
                                            <TableTypography>{model.email}</TableTypography>
                                        </TableCell>
                                        <TableCell>
                                            <TableTypography>{model.role}</TableTypography>
                                        </TableCell>
                                        <TableCell align='right'>{getStatusLabel(model.status)}</TableCell>
                                        <TableCell align='center'>
                                            {profile?.role === 'admin' && (
                                                <TableActions
                                                    nameModels='task'
                                                    handleViewModel={() => handleViewUserOpen(model)}
                                                    handleEditModel={() => handleEditUserOpen(model)}
                                                />
                                            )}
                                            {profile?.role === 'manager' &&
                                                (model.role === 'employee' ? (
                                                    <TableActions
                                                        nameModels='task'
                                                        handleViewModel={() => handleViewUserOpen(model)}
                                                        handleEditModel={() => handleEditUserOpen(model)}
                                                    />
                                                ) : (
                                                    <TableActions
                                                        nameModels='task'
                                                        handleViewModel={() => handleViewUserOpen(model)}
                                                    />
                                                ))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box p={2}>
                    <TablePagination
                        component='div'
                        count={modelList.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25, 30]}
                    />
                </Box>
            </Card>

            <MuiDialog title='Edit user' subTitle='' open={openEdit} handleClose={handleEditDialogClose}>
                <form noValidate onSubmit={handleSubmit(handleEditSubmit2)}>
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
                                        <MuiReadOnlyTextField label='UserName' name='userName' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiReadOnlyTextField label='Email address' name='email' control={control} />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Button size='large' variant='contained' onClick={handleEditPasswordOpen}>
                                            Change password
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <StatusToggleButton
                                            name='status'
                                            control={control}
                                            statusValues={statusValues}
                                        />
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
            </MuiDialog>

            <MuiDialog
                title='Change password'
                subTitle=''
                open={openEditPassword}
                handleClose={handleEditPasswordClose}
            >
                <form noValidate onSubmit={handleSubmitPassword(handleEditPasswordSubmit2, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='Password'
                                            name='password'
                                            control={controlPassword}
                                            autoComplete='on'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <MuiTextField
                                            type='password'
                                            label='Confirm password'
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
            <MuiDialog title='User Profile' subTitle='' open={openView} handleClose={handleViewUserClose}>
                <DialogContent dividers sx={{ p: 3 }}>
                    <UserProfile userCurrent={userCurrent} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button color='secondary' onClick={handleViewUserClose}>
                        {'Cancel'}
                    </Button>
                </DialogActions>
            </MuiDialog>
        </>
    );
};

UserList2.propTypes = {
    modelList: PropTypes.array.isRequired
};

UserList2.defaultProps = {
    modelList: []
};

export default UserList2;
