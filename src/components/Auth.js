import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const _user = JSON.parse(localStorage.getItem("user")) === null ? undefined : JSON.parse(localStorage.getItem("user"))
    const [currentUser, setCurrentUser] = useState(_user);

    const signin = async (username, email, password) => {
        // Hash the password before sending it to the server
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert the new user into the "users" table
        try {
            await axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/api/users`, {
                username: username,
                password: hashedPassword,
                email: email,
            });
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    const login = async (email, password) => {
        try {
            // Retrieve the user from the "users" table
            const { data } = await axios.get(`${process.env.REACT_APP_ALBUM_SERVER}/api/users?email=${email}`);
            const user = data[0];

            // Compare the hashed password stored in the "users" table with the input password
            const passwordMatch = bcrypt.compareSync(password, user.password);

            if (passwordMatch) {
                // Store user information in local storage
                localStorage.setItem("user", JSON.stringify(user))
                setCurrentUser(user);
                setIsLoggedIn(true);
            }
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setCurrentUser(undefined);
    };

    const isSignedIn = () => {
        if (localStorage.getItem("user") !== null) {
            setCurrentUser(JSON.parse(localStorage.getItem("user")));
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        isSignedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isLoggedIn,
                login,
                logout,
                signin,
                isSignedIn
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
