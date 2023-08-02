import { UserType } from 'src/types/UserType';

export const clearLS = () => {
    localStorage.removeItem('profile');
    sessionStorage.removeItem('profile');
};

export const getProfileFromLS = () => {
    const result = sessionStorage.getItem('profile');
    const result2 = localStorage.getItem('profile');
    if (result) {
        return JSON.parse(result);
    } else if (result2) {
        sessionStorage.setItem('profile', result2);
        return JSON.parse(result2);
    }
    return null;
};

export const setProfileToLS = (profile: UserType) => {
    localStorage.setItem('profile', JSON.stringify(profile));
    sessionStorage.setItem('profile', JSON.stringify(profile));
};
