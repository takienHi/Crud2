import useRouteElements from './useRouteElements';
import ThemeProvider from './theme/ThemeProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { CssBaseline } from '@mui/material';

import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '1068744228163-qvdel1c0qn91jk3q7dgdrb3ilo7ih17q.apps.googleusercontent.com';
function App() {
    const routeElements = useRouteElements();
    return (
        <>
            <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CssBaseline />
                    <SnackbarProvider>
                        <GoogleOAuthProvider clientId={clientId}>{routeElements}</GoogleOAuthProvider>;
                    </SnackbarProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
