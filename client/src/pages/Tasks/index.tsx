import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useContext, useEffect, useState } from 'react';
import { TaskType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';
import TaskList from './TaskList';
import { AppContext } from 'src/contexts/app.context';

function Tasks() {
    const { profile } = useContext(AppContext);

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [filterString, setFilterString] = useState<string>('');

    const addUserComplete = () => {
        getTaskList();
    };

    const EditTaskComplete = () => {
        getTaskList();
    };

    const filterStringChanged = (filterStr: string) => {
        setFilterString(filterStr);
    };

    const getTaskList = () => {
        if (profile?.role === 'admin' || profile?.role === 'manager') {
            TaskApi.getAll(filterString)
                .then((response: any) => {
                    setTasks(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        } else {
            TaskApi.getByUserId(profile?.id, filterString)
                .then((response: any) => {
                    setTasks(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        }
    };

    useEffect(() => {
        getTaskList();
    }, [filterString]);

    return (
        <>
            <Helmet>
                <title>Tasks</title>
            </Helmet>
            <PageTitleWrapper>
                <PageHeader addUserComplete={addUserComplete} />
            </PageTitleWrapper>
            <Container maxWidth='lg'>
                <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
                    <Grid item xs={12}>
                        <TaskList
                            modelList={tasks}
                            filterStringChanged={filterStringChanged}
                            EditTaskComplete={EditTaskComplete}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default Tasks;
