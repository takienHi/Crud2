import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

type PageHeaderProps = {
    handleAction: () => void;
    buttonTitle: string;
    title: string;
    subTitle: string;
};

function PageHeader({ handleAction, buttonTitle, title, subTitle }: PageHeaderProps) {
    return (
        <>
            <Grid container justifyContent='space-between' alignItems='center'>
                <Grid item>
                    <Typography variant='h3' component='h3' gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant='subtitle2'>{subTitle}</Typography>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            mt: { xs: 2, sm: 0 }
                        }}
                        onClick={handleAction}
                        variant='contained'
                        startIcon={<AddTwoToneIcon fontSize='small' />}
                    >
                        {buttonTitle}
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

export default PageHeader;
