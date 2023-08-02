import { useContext, useRef, useState } from 'react';

import {
    Avatar,
    Box,
    Button,
    Divider,
    Hidden,
    lighten,
    List,
    ListItem,
    ListItemText,
    Popover,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { AppContext } from 'src/contexts/app.context';
import { clearLS } from 'src/utils/auth';
import CloseIcon from '@mui/icons-material/Close';
import UserProfile from './UserProfile';
const UserBoxButton = styled(Button)(
    ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
    ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
    ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
    ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
    ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
    const { setIsAuthenticated, profile, setProfile } = useContext(AppContext);
    const [openView, setOpenView] = useState<boolean>(false);

    const handleViewUserClose = () => {
        setOpenView(false);
    };

    const handleViewUserOpen = () => {
        setOpenView(true);
    };
    const user = {
        name: 'Catherine Pike',
        avatar: '/static/images/avatars/1.jpg',
        jobtitle: 'Project Manager'
    };

    const ref = useRef<any>(null);
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const logoutUser = () => {
        setIsAuthenticated(false);
        setProfile(null);
        clearLS();
    };

    return (
        <>
            <UserBoxButton color='secondary' ref={ref} onClick={handleOpen}>
                <Avatar variant='rounded' alt={profile?.fullName} src={user.avatar} />
                <Hidden mdDown>
                    <UserBoxText>
                        <UserBoxLabel variant='body1'>{profile?.fullName}</UserBoxLabel>
                        <UserBoxDescription variant='body2'>{profile?.role}</UserBoxDescription>
                    </UserBoxText>
                </Hidden>
                <Hidden smDown>
                    <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
                </Hidden>
            </UserBoxButton>
            <Popover
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <MenuUserBox sx={{ minWidth: 210 }} display='flex'>
                    <Avatar variant='rounded' alt={profile?.fullName} src={user.avatar} />
                    <UserBoxText>
                        <UserBoxLabel variant='body1'>{profile?.fullName}</UserBoxLabel>
                        <UserBoxDescription variant='body2'>{profile?.role}</UserBoxDescription>
                    </UserBoxText>
                </MenuUserBox>
                <Divider sx={{ mb: 0 }} />
                <List sx={{ p: 1 }} component='nav'>
                    <ListItem button onClick={() => handleViewUserOpen()}>
                        <AccountBoxTwoToneIcon fontSize='small' />
                        <ListItemText primary='My Profile' />
                    </ListItem>
                </List>
                <Divider />
                <Box sx={{ m: 1 }}>
                    <Button color='primary' onClick={logoutUser} fullWidth>
                        <LockOpenTwoToneIcon sx={{ mr: 1 }} />
                        Sign out
                    </Button>
                </Box>
            </Popover>
            <Dialog fullWidth maxWidth='sm' open={openView} onClose={handleViewUserClose}>
                <DialogTitle
                    sx={{
                        p: 3
                    }}
                >
                    <Typography variant='h4' gutterBottom>
                        {'Profile'}
                    </Typography>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: 3
                    }}
                >
                    <UserProfile />
                </DialogContent>
                <DialogActions
                    sx={{
                        p: 3
                    }}
                >
                    <Button color='secondary' onClick={handleViewUserClose}>
                        {'Cancel'}
                    </Button>
                </DialogActions>
                <IconButton
                    aria-label='close'
                    onClick={handleViewUserClose}
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

export default HeaderUserbox;
