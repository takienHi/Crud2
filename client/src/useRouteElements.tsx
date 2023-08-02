import { useContext } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import BaseLayout from './Layouts/BaseLayout';
import SidebarLayout from './Layouts/SidebarLayout';

import Home from './pages/Home';
import Users from './pages/User';
import Tasks from './pages/Tasks';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { AppContext } from './contexts/app.context';
import paths from './utils/paths';

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext);

    return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} />;
}

function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext);

    return !isAuthenticated ? <Outlet /> : <Navigate to={paths.home} />;
}

function CheckAuth() {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <RejectedRoute /> : <ProtectedRoute />;
}

const notLoggedRoute = {
    path: '',
    element: <RejectedRoute />,
    children: [
        {
            path: paths.login,
            element: (
                <BaseLayout>
                    <Login />
                </BaseLayout>
            )
        },
        {
            path: paths.register,
            element: (
                <BaseLayout>
                    <Register />
                </BaseLayout>
            )
        }
    ]
};

const loggedRoute = {
    path: '',
    element: <ProtectedRoute />,
    children: [
        {
            path: 'dashboard',
            element: <SidebarLayout></SidebarLayout>,
            children: [
                {
                    path: '',
                    element: <Home />
                },
                {
                    path: 'users',
                    element: <Users />
                },
                {
                    path: 'tasks',
                    element: <Tasks />
                }
            ]
        }
    ]
};

function useRouteElements() {
    const routeElements = useRoutes([
        notLoggedRoute,
        loggedRoute,
        {
            path: '',
            index: true,
            element: <CheckAuth />
        }
    ]);

    return routeElements;
}

export default useRouteElements;
