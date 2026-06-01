import { createContext, useContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [refToken, setRefToken] = useState(null);
    return (
        <LoginContext.Provider value={{ refToken, setRefToken }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);