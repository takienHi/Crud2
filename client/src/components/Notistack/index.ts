import { enqueueSnackbar } from 'notistack';
import { Zoom } from '@mui/material';

export const notistackSuccess = (text: string) => {
    return enqueueSnackbar(text, {
        variant: 'success',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 1500
    });
};

export const notistackError = (text: string) => {
    return enqueueSnackbar(text, {
        variant: 'error',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        TransitionComponent: Zoom,
        autoHideDuration: 1500
    });
};
