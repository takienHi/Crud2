import React, { createContext, useState } from 'react';

import { getProfileFromLS } from '../utils/auth';
import { UserType } from 'src/types/UserType';

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    profile: UserType | null;
    setProfile: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getProfileFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);

    const [profile, setProfile] = useState<UserType | null>(initialAppContext.profile);

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile,
                setProfile
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
