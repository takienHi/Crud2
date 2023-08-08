import { Box, Typography, Link, Badge, List, ListItem, ListItemText, Avatar, Divider, useTheme } from '@mui/material';

import { UserType } from 'src/types/UserType';
import Label from 'src/components/Label';
import TaskList from '../TaskList';
import { useEffect, useState } from 'react';
import { TaskType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';

type PropsType = {
    userCurrent?: UserType;
};

function Profile({ userCurrent }: PropsType) {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [filterString, setFilterString] = useState<string>('');

    const getTaskList = () => {
        console.log('userCurrent', userCurrent);

        TaskApi.getByUserId(userCurrent?.id, filterString)
            .then((response: any) => {
                setTasks(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const EditTaskComplete = () => {
        getTaskList();
    };

    const filterStringChanged = (filterStr: string) => {
        setFilterString(filterStr);
    };

    useEffect(() => {
        getTaskList();
    }, [filterString]);

    const theme = useTheme();
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
                        {userCurrent?.userName}
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
                        {userCurrent?.fullName}
                    </Link>
                    <Typography gutterBottom variant='subtitle2'>
                        {userCurrent?.role}
                    </Typography>
                </Box>
                <Box sx={{ width: '100%' }} mr={'10%'}>
                    <List disablePadding sx={{ my: 1.5 }}>
                        <ListItem disableGutters>
                            <ListItemText
                                primaryTypographyProps={{
                                    variant: 'h5'
                                }}
                                primary={`${'UserName'}:`}
                            />
                            <Typography variant='subtitle1'>{userCurrent?.userName}</Typography>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText primaryTypographyProps={{ variant: 'h5' }} primary={`${'Email'}:`} />
                            <Typography variant='subtitle1'>{userCurrent?.email}</Typography>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemText primaryTypographyProps={{ variant: 'h5' }} primary={`${'Status'}:`} />
                            <Typography variant='subtitle1'>
                                {userCurrent?.status === 'active' ? (
                                    <Label color='success'>Active</Label>
                                ) : (
                                    <Label color='error'>Disabled</Label>
                                )}
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </Box>
            {userCurrent?.role === 'employee' &&
                (tasks.length >= 1 ? (
                    <TaskList
                        modelList={tasks}
                        filterStringChanged={filterStringChanged}
                        EditTaskComplete={EditTaskComplete}
                    />
                ) : (
                    <>
                        <Typography variant='subtitle1' align='center'>
                            No data...
                        </Typography>
                    </>
                ))}
        </>
    );
}

export default Profile;
