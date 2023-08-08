import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageHeader from 'src/components/PageHeader';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Button, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';

import Footer from 'src/components/Footer';

import { useContext, useEffect, useState } from 'react';
import { TaskType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';
import TaskList from './TaskList';
import { AppContext } from 'src/contexts/app.context';
import MuiDialog from 'src/components/MuiDialog/MuiDialog';
import MuiTextField from 'src/components/MuiTextField/MuiTextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TaskSchema, taskSchema } from 'src/schema/taskSchema';
import { notistackSuccess } from 'src/components/Notistack';
import TabPanel from 'src/components/MuiTabPanel/MuiTabPanel';

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}
type FormData = Omit<TaskSchema, 'status'>;
const createTaskSchema = taskSchema.omit(['status']);
function Tasks() {
    const { profile } = useContext(AppContext);

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [myTasks, setMyTasks] = useState<TaskType[]>([]);

    const [filterString, setFilterString] = useState<string>('');
    const [openCreateDialog, setCreateDialog] = useState(false);

    const createDialogClose = () => {
        setCreateDialog(false);
        reset();
    };

    const createDialogOpen = () => {
        setCreateDialog(true);
    };

    const addUserComplete = () => {
        getTaskList();
    };

    const editTaskComplete = () => {
        getTaskList();
    };

    const filterStringChanged = (filterStr: string) => {
        setFilterString(filterStr);
    };

    const getTaskList = () => {
        TaskApi.getAll(filterString)
            .then((response: any) => {
                setTasks(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
        TaskApi.getByUserId(profile?.id, filterString)
            .then((response: any) => {
                setMyTasks(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(() => {
        getTaskList();
    }, [filterString]);

    const { handleSubmit, control, reset } = useForm<FormData>({
        mode: 'onSubmit',
        resolver: yupResolver(createTaskSchema)
    });

    const handleFormSubmit = (formValues: FormData) => {
        const data: TaskType = {
            id: '',
            title: formValues.title,
            description: formValues.description,
            status: 'incomplete',
            userId: profile?.id
        };

        TaskApi.create(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((_response: any) => {
                createDialogClose();
                notistackSuccess('The new task has been add');
                addUserComplete();
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const onError = (errors: any) => {
        console.log('form errors: ', errors);
    };

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Helmet>
                <title>Tasks</title>
            </Helmet>
            <PageTitleWrapper>
                {profile?.role !== 'admin' ? (
                    <PageHeader
                        handleAction={createDialogOpen}
                        title='Task Management'
                        subTitle='All aspects related to the app tasks can be managed from this page'
                        buttonTitle='Create task'
                    />
                ) : (
                    <PageHeader
                        title='Task Management'
                        subTitle='All aspects related to the app tasks can be managed from this page'
                    />
                )}
            </PageTitleWrapper>
            {profile?.role === 'manager' && (
                <Container maxWidth='lg'>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor='secondary'
                        textColor='inherit'
                        variant='fullWidth'
                        aria-label='full width tabs example'
                    >
                        <Tab label='All Tasks' {...a11yProps(0)} />
                        <Tab label='My Tasks' {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                            <Grid item xs={12}>
                                <TaskList
                                    modelList={tasks}
                                    filterStringChanged={filterStringChanged}
                                    editTaskComplete={editTaskComplete}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                            <Grid item xs={12}>
                                <TaskList
                                    modelList={myTasks}
                                    filterStringChanged={filterStringChanged}
                                    editTaskComplete={editTaskComplete}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Container>
            )}

            {profile?.role === 'admin' && (
                <Container maxWidth='lg'>
                    <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                        <Grid item xs={12}>
                            <TaskList
                                modelList={tasks}
                                filterStringChanged={filterStringChanged}
                                editTaskComplete={editTaskComplete}
                            />
                        </Grid>
                    </Grid>
                </Container>
            )}

            {profile?.role === 'employee' && (
                <Container maxWidth='lg'>
                    <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                        <Grid item xs={12}>
                            <TaskList
                                modelList={myTasks}
                                filterStringChanged={filterStringChanged}
                                editTaskComplete={editTaskComplete}
                            />
                        </Grid>
                    </Grid>
                </Container>
            )}
            <Footer />
            <MuiDialog
                open={openCreateDialog}
                handleClose={createDialogClose}
                title='Add new task'
                subTitle='Fill in the fields below to create and add a new task to the site'
            >
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
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button color='secondary' onClick={createDialogClose}>
                            {'Cancel'}
                        </Button>
                        <Button type='submit' variant='contained'>
                            {'Add new task'}
                        </Button>
                    </DialogActions>
                </form>
            </MuiDialog>
        </>
    );
}

export default Tasks;
