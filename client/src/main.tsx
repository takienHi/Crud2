import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'nprogress/nprogress.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import { AppProvider } from './contexts/app.context';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <HelmetProvider>
        <SidebarProvider>
            <BrowserRouter>
                <AppProvider>
                    <App />
                </AppProvider>
            </BrowserRouter>
        </SidebarProvider>
    </HelmetProvider>
    //</React.StrictMode>
);

serviceWorker.unregister();
