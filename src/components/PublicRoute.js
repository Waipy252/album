import { Outlet } from "react-router-dom";
import React from 'react';

const PublicRoute = ({ component, ...rest }) => {
    return (
        <>
            <Outlet />;
        </>
    );
};

export default PublicRoute;