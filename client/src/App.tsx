import useRouteElements from './useRouteElements';
import ThemeProvider from './theme/ThemeProvider';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { CssBaseline } from '@mui/material';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SnackbarProvider } from 'notistack';

function App() {
    const routeElements = useRouteElements();
    return (
        <>
            <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <CssBaseline />
                    <SnackbarProvider>{routeElements}</SnackbarProvider>
                    <ToastContainer />
                </LocalizationProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
