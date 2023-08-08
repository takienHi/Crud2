import {
    Box,
    Card,
    Typography,
    Link,
    Badge,
    List,
    ListItem,
    ListItemText,
    Avatar,
    alpha,
    IconButton,
    Button,
    Divider,
    LinearProgress,
    styled,
    useTheme,
    linearProgressClasses
} from '@mui/material';

import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { TaskType } from 'src/types/TaskType';
import Label from 'src/components/Label';

const LinearProgressPrimary = styled(LinearProgress)(
    ({ theme }) => `
          height: 6px;
          border-radius: ${theme.general.borderRadiusLg};
  
          &.${linearProgressClasses.colorPrimary} {
              background-color: ${alpha(theme.colors.primary.main, 0.1)};
          }
          
          & .${linearProgressClasses.bar} {
              border-radius: ${theme.general.borderRadiusLg};
              background-color: ${theme.colors.primary.main};
          }
      `
);

const CardActions = styled(Box)(
    ({ theme }) => `
      position: absolute;
      right: ${theme.spacing(1.5)};
      top: ${theme.spacing(1.5)};
      z-index: 7;
    `
);

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
            <Typography variant='subtitle2'>{taskCurrent.description}.</Typography>
            <Divider sx={{ mt: 3 }} />
            <List disablePadding sx={{ my: 1.5 }}>
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'Full name'}:`}
                    />
                    <Typography variant='subtitle1'>{taskCurrent.user?.fullName}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'username'}:`}
                    />
                    <Typography variant='subtitle1'>{taskCurrent.user?.userName}</Typography>
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText
                        primaryTypographyProps={{
                            variant: 'h5'
                        }}
                        primary={`${'Status'}:`}
                    />
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
