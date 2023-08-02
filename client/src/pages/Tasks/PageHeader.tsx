import { ChangeEvent, useContext, useState } from 'react';

import {
    Grid,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    TextField,
    Button,
    IconButton
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { TaskType } from 'src/types/TaskType';
import TaskApi from 'src/apis/task.api';
import { AppContext } from 'src/contexts/app.context';
import { notistackSuccess } from 'src/components/Notistack';

type PageHeaderProps = {
    addUserComplete: () => void;
};

function PageHeader({ addUserComplete }: PageHeaderProps) {
    const { profile } = useContext(AppContext);

    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const resetForm = () => {
        setTitle('');
        setDescription('');
    };

    const handleSubmit = () => {
        const data: TaskType = {
            id: '',
            title: title,
            description: description,
            status: 'incomplete',
            userId: profile?.id
        };

        TaskApi.create(data)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then((_response: any) => {
                setOpen(false);
                resetForm();
                notistackSuccess('The new user has been add');
                addUserComplete();
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    const handleCreateUserOpen = () => {
        setOpen(true);
    };

    const handleCreateUserClose = () => {
        setOpen(false);
    };

    // const handleCreateUserSuccess = () => {
    //     enqueueSnackbar('The task account was created successfully', {
    //         variant: 'success',
    //         anchorOrigin: {
    //             vertical: 'top',
    //             horizontal: 'right'
    //         },
    //         TransitionComponent: Zoom
    //     });

    //     setOpen(false);
    // };

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    };

    const onChangeDescription = (e: ChangeEvent<HTMLInputElement>): void => {
        setDescription(e.target.value);
    };
    return (
        <>
            <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='h3' component='h3' gutterBottom>
                        {profile?.role === 'admin' ? 'All Tasks Users' : 'My tasks'}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 }
                        }}
                        onClick={handleCreateUserOpen}
                        variant='contained'
                        startIcon={<AddTwoToneIcon fontSize='small' />}
                    >
                        {'Create task'}
                    </Button>
                </Grid>
            </Grid>
            <Dialog fullWidth maxWidth='md' open={open} onClose={handleCreateUserClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Add new task'}
                    </Typography>
                    <Typography variant='subtitle2'>
                        {'Fill in the fields below to create and add a new task to the site'}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={'Title'}
                                    name='title'
                                    onChange={onChangeTitle}
                                    value={title}
                                    variant='outlined'
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={'Description'}
                                    name='description'
                                    onChange={onChangeDescription}
                                    value={description}
                                    variant='outlined'
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 3
                        }}
                    >
                        <Button color='secondary' onClick={handleCreateUserClose}>
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleSubmit} variant='contained'>
                            {'Add new task'}
                        </Button>
                    </DialogActions>
                </form>
                <IconButton
                    aria-label='close'
                    onClick={handleCreateUserClose}
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
}

export default PageHeader;
