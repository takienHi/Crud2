import { Box, Typography, Link, List, ListItem, ListItemText, Divider, useTheme, TextField } from '@mui/material';

import { TaskType } from 'src/types/TaskType';
import Label from 'src/components/Label';

type TaskViewProps = {
    taskCurrent: TaskType;
};

function TaskView({ taskCurrent }: TaskViewProps) {
    const theme = useTheme();

    return (
        <>
            <Box mb={2} display='flex' alignItems='center'>
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
                        {taskCurrent.title}
                    </Link>
                </Box>
            </Box>
            <TextField
                fullWidth
                value={taskCurrent.description}
                variant='outlined'
                inputProps={{ readOnly: true }}
                multiline
                minRows={5}
                maxRows={100}
                sx={{ backgroundColor: '#f0f0f0', border: 'none' }}
            ></TextField>
            <Divider sx={{ mt: 3 }} />
            <List disablePadding sx={{ my: 1.5 }}>
                <ListItem disableGutters>
                    <ListItemText primaryTypographyProps={{ variant: 'h5' }} primary={`${'Full name'}:`} />
                    <Typography variant='subtitle1'>{taskCurrent.user?.fullName}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText primaryTypographyProps={{ variant: 'h5' }} primary={`${'username'}:`} />
                    <Typography variant='subtitle1'>{taskCurrent.user?.userName}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText primaryTypographyProps={{ variant: 'h5' }} primary={`${'Status'}:`} />
                    <Typography variant='subtitle1'>
                        {taskCurrent?.status === 'completed' ? (
                            <Label color='success'>Completed</Label>
                        ) : (
                            <Label color='error'>Incomplete</Label>
                        )}
                    </Typography>
                </ListItem>
            </List>
        </>
    );
}

export default TaskView;
