import React, { createContext, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../config/axios';
// Create the UserContext
// export const UserContext = createContext();

// // Create a provider component
// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     // const login = (userData) => {
//     //     setUser(userData);
//     // };

//     // const logout = () => {
//     //     setUser(null);
//     // };

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserContext.Provider>
//     );
// };
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axiosInstance.get('/users/logout');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
// Custom hook to use the UserContext
// export const useUser = () => {
//     return useContext(UserContext);
// };

