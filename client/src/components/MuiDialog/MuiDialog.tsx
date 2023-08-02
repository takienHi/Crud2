import { Grid, Dialog, DialogTitle, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type MuiDialogProps = {
    title: string;
    subTitle: string;
    open: boolean;
    handleClose: () => void;
    children?: any;
};

function MuiDialog({ title, subTitle, open, handleClose, children }: MuiDialogProps) {
    return (
        <>
            <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant='subtitle2'>{subTitle}</Typography>
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
