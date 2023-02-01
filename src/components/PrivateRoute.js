import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import React from 'react';

const PrivateRoute = ({ component, ...rest }) => {
    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return (<Outlet />);
    } else {
        return (<Navigate to="/login" />);
    }
};

export default PrivateRoute;