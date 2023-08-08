import { FC, ChangeEvent, useState, useEffect, forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    FormControl,
    InputLabel,
    Card,
    Slide,
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
    Grid,
    TextField,
    InputAdornment,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    styled
} from '@mui/material';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CloseIcon from '@mui/icons-material/Close';

import { TaskType, TaskStatusType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';
import { AppContext } from 'src/contexts/app.context';
import TaskView from './TaskView';
import { notistackError, notistackSuccess } from 'src/components/Notistack';
import TableActions from '../components/TableActions';
import TableTypography from 'src/components/TableTypography';
import MuiDialog from 'src/components/MuiDialog/MuiDialog';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import { useForm } from 'react-hook-form';
import { TaskSchema, taskSchema } from 'src/schema/taskSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import StatusToggleButton from 'src/components/StatusToggleButton';

interface RecentOrdersTableProps {
    className?: string;
    modelList: TaskType[];
    filterStringChanged: (filterStr: string) => void;
    editTaskComplete: () => void;
}

interface Filters {
    status?: any;
    searchStr?: any;
}

const ButtonError = styled(Button)(
    ({ theme }: any) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);

const DialogWrapper = styled(Dialog)(
    () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);

const AvatarError = styled(Avatar)(
    ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);

const Transition = forwardRef(function Transition(props: any, ref: any) {
    return <Slide direction='down' ref={ref} {...props} />;
});

const statusOptions = [
    {
        id: 'all',
        name: 'All'
    },
    {
        id: 'completed',
        name: 'Completed'
    },
    {
        id: 'incomplete',
        name: 'Incomplete'
    }
];

const statusValues = [
    {
        title: 'Completed',
        value: 'completed'
    },
    {
        title: 'Incomplete',
        value: 'incomplete'
    }
];

const getStatusLabel = (taskStatus: TaskStatusType): JSX.Element => {
    const map = {
        incomplete: {
            text: 'Incomplete',
            color: 'error'
        },
        completed: {
            text: 'Completed',
            color: 'success'
        }
    };

    const { text, color }: any = map[taskStatus];

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

const applyPagination = (modelList: TaskType[], page: number, limit: number): TaskType[] => {
    return modelList.slice(page * limit, page * limit + limit);
};
const taskCurrentDefault: TaskType = {
    id: '',
    title: '',
    description: '',
    status: 'incomplete',
    userId: ''
};

type FormData = TaskSchema;
const editTaskSchema = taskSchema;

const TaskList: FC<RecentOrdersTableProps> = ({ modelList, filterStringChanged, editTaskComplete }) => {
    const { profile } = useContext(AppContext);

    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState({
        status: null,
        searchStr: ''
    });
    const paginatedCryptoOrders = applyPagination(modelList, page, limit);
    const [taskCurrent, setTaskCurrent] = useState<TaskType>(taskCurrentDefault);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [openView, setOpenView] = useState<boolean>(false);

    const handleEditDialogOpen = () => {
        setOpenEdit(true);
        console.log(taskCurrent);
    };

    const handleConfirmDelete = (model: TaskType) => {
        setTaskCurrent(model);
        setOpenConfirmDelete(true);
    };

    const closeConfirmDelete = () => {
        setTaskCurrent(taskCurrentDefault);
        setOpenConfirmDelete(false);
    };

    const handleDeleteCompleted = () => {
        const id = taskCurrent.id;
        TaskApi.remove(id)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((response: any) => {
                editTaskComplete();
                notistackSuccess('The task has been removed');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        setOpenConfirmDelete(false);
    };

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

    const handleEditTaskClose = () => {
        setOpenEdit(false);
        reset();
    };

    const handleEditTaskOpen = (model: TaskType) => {
        if (model.id !== undefined) {
            setTaskCurrent(model);
            handleEditDialogOpen();
        } else {
            notistackError('This user could not be found ');
        }
    };

    const handleViewTaskClose = () => {
        setTaskCurrent(taskCurrentDefault);
        setOpenView(false);
    };

    const handleViewUserOpen = (model: TaskType) => {
        const id = model.id ? model.id.toString() : '';
        TaskApi.getById(id)
            .then((response: any) => {
                setTaskCurrent(() => ({
                    ...response.data,
                    password: ''
                }));
            })
            .catch((e: Error) => {
                console.log(e);
            });
        setOpenView(true);
    };

    const { handleSubmit, control, reset } = useForm<FormData>({
        mode: 'onSubmit',
        resolver: yupResolver<FormData>(editTaskSchema),
        defaultValues: {
            title: taskCurrent.title,
            description: taskCurrent.description,
            status: taskCurrent.status
        }
    });

    const handleFormSubmit = (formValues: FormData) => {
        const id = taskCurrent.id;
        const data: FormData = {
            ...formValues
        };

        TaskApi.update2(id, data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then(() => {
                setTaskCurrent(taskCurrentDefault);
                editTaskComplete();
                notistackSuccess('The task has been updated');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        handleEditTaskClose();
    };

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    useEffect(() => {
        reset(taskCurrent);
    }, [taskCurrent]);

    return (
        <>
            <Card sx={{ p: 1, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={8}>
                        <Box p={1}>
                            <TextField
                                sx={{ m: 0 }}
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
            <Card sx={{ p: 1, mb: 3 }}>
                <TableContainer>
                    <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '5%' }}>#</TableCell>
                                <TableCell>Task name</TableCell>
                                <TableCell>Description</TableCell>
                                {profile?.role !== 'employee' && <TableCell sx={{ width: '10%' }}>UserName</TableCell>}
                                <TableCell sx={{ width: '10%' }} align='center'>
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
                                            <TableTypography>{model.title}</TableTypography>
                                        </TableCell>
                                        <TableCell>
                                            <TableTypography>{model.description}</TableTypography>
                                        </TableCell>
                                        {profile?.role !== 'employee' && (
                                            <TableCell>
                                                <TableTypography>{model.user?.userName}</TableTypography>
                                            </TableCell>
                                        )}
                                        <TableCell align='center'>{getStatusLabel(model.status)}</TableCell>
                                        <TableCell align='center'>
                                            <TableTypography>
                                                {profile?.role === 'manager' ? (
                                                    model.id === profile.id ? (
                                                        <TableActions
                                                            nameModels='task'
                                                            handleViewModel={() => handleViewUserOpen(model)}
                                                            handleEditModel={() => handleEditTaskOpen(model)}
                                                            handleDeleteModel={() => handleConfirmDelete(model)}
                                                        />
                                                    ) : (
                                                        <TableActions
                                                            nameModels='task'
                                                            handleViewModel={() => handleViewUserOpen(model)}
                                                        />
                                                    )
                                                ) : (
                                                    <TableActions
                                                        nameModels='task'
                                                        handleViewModel={() => handleViewUserOpen(model)}
                                                        handleEditModel={() => handleEditTaskOpen(model)}
                                                        handleDeleteModel={() => handleConfirmDelete(model)}
                                                    />
                                                )}
                                            </TableTypography>
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
            <MuiDialog open={openEdit} handleClose={handleEditTaskClose} title='Edit task'>
                <form noValidate onSubmit={handleSubmit(handleFormSubmit, onError)}>
                    <DialogContent dividers sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <MuiTextField label='Title' name='title' control={control} />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <MuiTextField
                                            label='Description'
                                            name='description'
                                            control={control}
                                            multiline
                                            minRows={5}
                                            maxRows={10}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}></Grid>
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
                        <Button color='secondary' onClick={handleEditTaskClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
                            {'Edit task'}
                        </Button>
                    </DialogActions>
                </form>
            </MuiDialog>

            <DialogWrapper
                open={openConfirmDelete}
                maxWidth='sm'
                fullWidth
                TransitionComponent={Transition}
                keepMounted
                onClose={closeConfirmDelete}
            >
                <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' p={5}>
                    <AvatarError>
                        <CloseIcon />
                    </AvatarError>

                    <Typography align='center' sx={{ py: 4, px: 6 }} variant='h3'>
                        {'Are you sure you want to permanently delete this user account'}?
                    </Typography>

                    <Box>
                        <Button variant='text' size='large' sx={{ mx: 1 }} onClick={closeConfirmDelete}>
                            {'Cancel'}
                        </Button>
                        <ButtonError
                            onClick={handleDeleteCompleted}
                            size='large'
                            sx={{ mx: 1, px: 3 }}
                            variant='contained'
                        >
                            {'Delete'}
                        </ButtonError>
                    </Box>
                </Box>
            </DialogWrapper>
            <Dialog fullWidth maxWidth='sm' open={openView} onClose={handleViewTaskClose}>
                <DialogTitle sx={{ p: 3 }}>
                    <Typography variant='h4' gutterBottom>
                        {'Task'}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 3 }}>
                    <TaskView taskCurrent={taskCurrent} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button color='secondary' onClick={handleViewTaskClose}>
                        {'Cancel'}
                    </Button>
                </DialogActions>
                <IconButton
                    aria-label='close'
                    onClick={handleViewTaskClose}
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

TaskList.propTypes = {
    modelList: PropTypes.array.isRequired
};

TaskList.defaultProps = {
    modelList: []
};

export default TaskList;
