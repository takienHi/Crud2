import { GoogleLogout } from 'react-google-login';

const clientId = '1068744228163-qvdel1c0qn91jk3q7dgdrb3ilo7ih17q.apps.googleusercontent.com';

const GoogleLogoutButton = () => {
    const onSuccess = () => {
        alert('Logout made successfully');
    };

    return (
        <div>
            <GoogleLogout clientId={clientId} buttonText='Logout' onLogoutSuccess={onSuccess} />
        </div>
    );
};

export default GoogleLogoutButton;
