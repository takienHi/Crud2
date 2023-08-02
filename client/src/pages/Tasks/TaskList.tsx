import { FC, ChangeEvent, useState, useEffect, forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Tooltip,
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
    useTheme,
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
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

import { TaskType, TaskStatusType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';
import { AppContext } from 'src/contexts/app.context';
import TaskView from './TaskView';
import { notistackSuccess } from 'src/components/Notistack';

interface RecentOrdersTableProps {
    className?: string;
    modelList: TaskType[];
    filterStringChanged: (filterStr: string) => void;
    EditTaskComplete: () => void;
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

const TaskList: FC<RecentOrdersTableProps> = ({ modelList, filterStringChanged, EditTaskComplete }) => {
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
                EditTaskComplete();
                notistackSuccess('The task has been removed');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        setOpenConfirmDelete(false);
    };

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

    const handleCreateTaskOpen = () => {
        setOpenEdit(true);
    };

    const handleCreateTaskClose = () => {
        setOpenEdit(false);
    };

    const handleEditTaskOpen = (model: TaskType) => {
        setTaskCurrent(model);
        handleCreateTaskOpen();
    };

    const onChangeStatusTask = (e: any) => {
        const inputName = e.target.name;
        setTaskCurrent((prev) => ({
            ...prev,
            [inputName]: e.target.value
        }));
    };

    const onChangeCurrentTask = (e: ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name;
        setTaskCurrent((prev) => ({
            ...prev,
            [inputName]: e.target.value
        }));
    };

    const handleEditSubmit = () => {
        const id = taskCurrent.id;
        const data = {
            title: taskCurrent.title,
            description: taskCurrent.description,
            status: taskCurrent.status
        };
        TaskApi.update2(id, data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((response: any) => {
                setTaskCurrent(taskCurrentDefault);
                EditTaskComplete();
                notistackSuccess('The task has been updated');
            })
            .catch((e: Error) => {
                console.log(e);
            });
        handleCreateTaskClose();
    };

    const handleViewTaskClose = () => {
        setTaskCurrent(taskCurrentDefault);
        setOpenView(false);
    };

    const handleViewUserOpen = (id: string) => {
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
            <Card
                sx={{
                    p: 1,
                    mb: 3
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell width='20%'>Task name</TableCell>
                                <TableCell>Description</TableCell>
                                {profile?.role !== 'employee' && <TableCell>UserName</TableCell>}

                                <TableCell align='right'>Status</TableCell>
                                <TableCell align='right'>Actions</TableCell>
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
                                                noWrap
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
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {model.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: '2',
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {model.description}
                                            </Typography>
                                        </TableCell>
                                        {profile?.role !== 'employee' && (
                                            <TableCell>
                                                <Typography
                                                    variant='body1'
                                                    fontWeight='bold'
                                                    color='text.primary'
                                                    gutterBottom
                                                    noWrap
                                                >
                                                    {model.user?.userName}
                                                </Typography>
                                            </TableCell>
                                        )}

                                        <TableCell align='right'>{getStatusLabel(model.status)}</TableCell>
                                        <TableCell align='right'>
                                            <Typography
                                                variant='body1'
                                                fontWeight='bold'
                                                color='text.primary'
                                                gutterBottom
                                                noWrap
                                            >
                                                <Tooltip title='View user' arrow>
                                                    <IconButton
                                                        onClick={() => handleViewUserOpen(model.id.toString())}
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
                                                {(profile?.role === 'admin' || profile?.role === 'employee') && (
                                                    <>
                                                        <Tooltip title='Edit Task' arrow>
                                                            <IconButton
                                                                onClick={() => handleEditTaskOpen(model)}
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
                                                        <Tooltip title='Delete Order' arrow>
                                                            <IconButton
                                                                onClick={() => handleConfirmDelete(model)}
                                                                sx={{
                                                                    '&:hover': {
                                                                        background: theme.colors.error.lighter
                                                                    },
                                                                    color: theme.palette.error.main
                                                                }}
                                                                color='inherit'
                                                                size='small'
                                                            >
                                                                <DeleteTwoToneIcon fontSize='small' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Typography>
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

            <Dialog fullWidth maxWidth='md' open={openEdit} onClose={handleCreateTaskClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Edit task'}
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
                                            label={'Title'}
                                            name='title'
                                            onChange={onChangeCurrentTask}
                                            type='text'
                                            value={taskCurrent.title}
                                            variant='outlined'
                                            inputProps={{ maxLength: 255 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            fullWidth
                                            label={'Description'}
                                            name='description'
                                            onChange={onChangeCurrentTask}
                                            type='text'
                                            multiline
                                            minRows={5}
                                            maxRows={10}
                                            value={taskCurrent.description}
                                            variant='outlined'
                                            inputProps={{ maxLength: 300 }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        {taskCurrent.status === 'completed' ? (
                                            <Button
                                                name='status'
                                                onClick={onChangeStatusTask}
                                                value='incomplete'
                                                size='large'
                                                variant='contained'
                                                color='success'
                                            >
                                                Completed
                                            </Button>
                                        ) : (
                                            <Button
                                                name='status'
                                                value='completed'
                                                onClick={onChangeStatusTask}
                                                size='large'
                                                variant='contained'
                                                color='error'
                                            >
                                                Incomplete
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
                        <Button color='secondary' onClick={handleCreateTaskClose}>
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleEditSubmit} variant='contained'>
                            {'Save'}
                        </Button>
                    </DialogActions>
                </form>
                <IconButton
                    aria-label='close'
                    onClick={handleCreateTaskClose}
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

                    <Typography
                        align='center'
                        sx={{
                            py: 4,
                            px: 6
                        }}
                        variant='h3'
                    >
                        {'Are you sure you want to permanently delete this user account'}?
                    </Typography>

                    <Box>
                        <Button
                            variant='text'
                            size='large'
                            sx={{
                                mx: 1
                            }}
                            onClick={closeConfirmDelete}
                        >
                            {'Cancel'}
                        </Button>
                        <ButtonError
                            onClick={handleDeleteCompleted}
                            size='large'
                            sx={{
                                mx: 1,
                                px: 3
                            }}
                            variant='contained'
                        >
                            {'Delete'}
                        </ButtonError>
                    </Box>
                </Box>
            </DialogWrapper>
            <Dialog fullWidth maxWidth='sm' open={openView} onClose={handleViewTaskClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Task'}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: 3
                    }}
                >
                    <TaskView taskCurrent={taskCurrent} />
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 3
                    }}
                >
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
