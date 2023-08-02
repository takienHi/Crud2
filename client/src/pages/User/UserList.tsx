import { FC, ChangeEvent, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    // Autocomplete,
    Tooltip,
    Box,
    FormControl,
    InputLabel,
    Card,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Select,
    MenuItem,
    Typography,
    useTheme,
    Grid,
    TextField,
    InputAdornment,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import CloseIcon from '@mui/icons-material/Close';

import { UserType, UserStatusType } from 'src/types/UserType';
import UserApi from 'src/apis/user.api';
import { AppContext } from 'src/contexts/app.context';
import UserProfile from './UserProfile';
import { notistackError, notistackSuccess } from 'src/components/Notistack';
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

const filterString = (filters: Filters): string => {
    let filterStr = '';

    if (filters.searchStr) {
        filterStr = filterStr + 'q=' + filters.searchStr + '&';
    }

    if (filters.status && filters.status !== 'all') {
        filterStr = filterStr + 'status=' + filters.status + '&';
    }

    return filterStr;
};

const applyPagination = (modelList: UserType[], page: number, limit: number): UserType[] => {
    return modelList.slice(page * limit, page * limit + limit);
};

const UserList: FC<RecentOrdersTableProps> = ({ modelList, filterStringChanged, editUserComplete }) => {
    const { profile } = useContext(AppContext);

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState({
        status: null,
        searchStr: '',
        role: null
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

    const paginatedCryptoOrders = applyPagination(modelList, page, limit);
    const [userCurrent, setUserCurrent] = useState<UserType>(userCurrentDefault);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [openEditPassword, setOpenEditPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [helperTextStatus, setHelperTextStatus] = useState({
        fullName: false,
        password: false,
        passwordConfirm: false
    });

    const [helperTextStr, setHelperTextStr] = useState({
        fullName: '',
        password: '',
        passwordConfirm: ''
    });

    const theme = useTheme();

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
    }, [filters]);

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

    const onChangeCurrentUser = (e: ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name;
        setUserCurrent((prev) => ({
            ...prev,
            [inputName]: e.target.value
        }));
    };

    const onChangeStatusUser = (e: any) => {
        const inputName = e.target.name;
        setUserCurrent((prev) => ({
            ...prev,
            [inputName]: e.target.value
        }));
    };

    const handleEditSubmit = () => {
        const id = userCurrent.id;
        const data = {
            fullName: userCurrent.fullName,
            status: userCurrent.status
        };
        UserApi.update2(id, data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((response: any) => {
                setUserCurrent(userCurrentDefault);
                editUserComplete();
                notistackSuccess('The user has been updated');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        handleEditDialogClose();
    };

    const handleEditPasswordSubmit = () => {
        const id = userCurrent.id;
        const data = {
            password: userCurrent.password
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
        onChangeCurrentUser(e);
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
            if (userCurrent.fullName === null || userCurrent.fullName === '') {
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

    return (
        <>
            <Card
                sx={{
                    p: 1,
                    mb: 3
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={8}>
                        <Box p={1}>
                            <TextField
                                sx={{
                                    m: 0
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchTwoToneIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={handleSearchStrChange}
                                placeholder={'Search ...'}
                                value={filters.searchStr}
                                fullWidth
                                variant='outlined'
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Box p={1}>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel>{'Status'}</InputLabel>
                                <Select value={filters.status || 'all'} onChange={handleStatusChange} label={'Status'}>
                                    {statusOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Full name</TableCell>
                                <TableCell>User name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align='right'>Status</TableCell>
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCryptoOrders.map((model, index) => {
                                return (
                                    <TableRow hover key={model.id}>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                            >
                                                {limit * page + index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                            >
                                                {model.fullName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                            >
                                                {model.userName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                            >
                                                {model.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                            >
                                                {model.role}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='right'>{getStatusLabel(model.status)}</TableCell>
                                        <TableCell align='center'>
                                            <Tooltip title='View user' arrow>
                                                <IconButton
                                                    onClick={() => handleViewUserOpen(model)}
                                                    sx={{
                                                        '&:hover': {
                                                            background: theme.colors.warning.lighter
                                                        },
                                                        color: theme.palette.warning.main
                                                    }}
                                                    color='inherit'
                                                    size='small'
                                                >
                                                    <VisibilityTwoToneIcon fontSize='small' />
                                                </IconButton>
                                            </Tooltip>
                                            {profile?.role === 'admin' && (
                                                <>
                                                    <Tooltip title='Edit User' arrow>
                                                        <IconButton
                                                            onClick={() => handleEditUserOpen(model)}
                                                            sx={{
                                                                '&:hover': {
                                                                    background: theme.colors.primary.lighter
                                                                },
                                                                color: theme.palette.primary.main
                                                            }}
                                                            color='inherit'
                                                            size='small'
                                                        >
                                                            <EditTwoToneIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            {profile?.role === 'manager' && model.role === 'employee' ? (
                                                <>
                                                    <Tooltip title='Edit User' arrow>
                                                        <IconButton
                                                            onClick={() => handleEditUserOpen(model)}
                                                            sx={{
                                                                '&:hover': {
                                                                    background: theme.colors.primary.lighter
                                                                },
                                                                color: theme.palette.primary.main
                                                            }}
                                                            color='inherit'
                                                            size='small'
                                                        >
                                                            <EditTwoToneIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <></>
                                            )}
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
            <Dialog fullWidth maxWidth='md' open={openEdit} onClose={handleEditDialogClose}>
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
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            error={helperTextStatus.fullName}
                                            label={'Full name'}
                                            name='fullName'
                                            onBlur={handleBlur}
                                            onChange={onChangeFullName}
                                            value={userCurrent.fullName}
                                            helperText={helperTextStr.fullName}
                                            variant='outlined'
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label={'Role'}
                                            name='role'
                                            type='text'
                                            value={userCurrent.role}
                                            variant='filled'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label={'Username'}
                                            name='userName'
                                            // onChange={onChangeCurrentUser}
                                            value={userCurrent.userName}
                                            variant='filled'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label={'Email address'}
                                            name='email'
                                            type='email'
                                            // onChange={onChangeCurrentUser}
                                            value={userCurrent.email}
                                            variant='filled'
                                            inputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Button size='large' variant='contained' onClick={handleEditPasswordOpen}>
                                            Change password
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {userCurrent.status === 'active' ? (
                                            <Button
                                                name='status'
                                                onClick={onChangeStatusUser}
                                                value='disabled'
                                                size='large'
                                                variant='contained'
                                                color='success'
                                            >
                                                Active
                                            </Button>
                                        ) : (
                                            <Button
                                                name='status'
                                                value='active'
                                                onClick={onChangeStatusUser}
                                                size='large'
                                                variant='contained'
                                                color='error'
                                            >
                                                Disabled
                                            </Button>
                                        )}
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
            <Dialog fullWidth maxWidth='md' open={openEditPassword} onClose={handleEditPasswordClose}>
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
                                    <Grid item xs={12} md={6}>
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
                                    <Grid item xs={12} md={6}>
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
            <Dialog fullWidth maxWidth='lg' open={openView} onClose={handleViewUserClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'User'}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: 3
                    }}
                >
                    <UserProfile userCurrent={userCurrent} />
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 3
                    }}
                >
                    <Button color='secondary' onClick={handleViewUserClose}>
                        {'Cancel'}
                    </Button>
                </DialogActions>
                <IconButton
                    aria-label='close'
                    onClick={handleViewUserClose}
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
};

UserList.propTypes = {
    modelList: PropTypes.array.isRequired
};

UserList.defaultProps = {
    modelList: []
};

export default UserList;
