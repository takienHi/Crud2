import { Grid, Dialog, DialogTitle, Typography, IconButton, type DialogProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type MuiDialogProps = {
    title: string;
    subTitle?: string;
    open: boolean;
    handleClose: () => void;
    children?: any;
} & DialogProps;

function MuiDialog({ title, subTitle, open, handleClose, children, ...otherProps }: MuiDialogProps) {
    return (
        <>
            <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose} {...otherProps}>
                <DialogTitle sx={{ p: 3 }}>
                    <Typography variant='h4' gutterBottom>
                        {title}
                    </Typography>
                    {subTitle ? <Typography variant='subtitle2'>{subTitle}</Typography> : <></>}
                </DialogTitle>
                {children}
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
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

export default MuiDialog;
