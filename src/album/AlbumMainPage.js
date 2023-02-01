import Grid from '@mui/material/Grid';
import AlbumPageFrame from './AlbumPageFrame'
import AlbumMenu from './AlbumMenu'
import { AlbumProvider } from './Album'
import AlbumImageView from './AlbumImageView'
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../components/Auth'
import { useNavigate } from 'react-router-dom';

export default function AlbumMainPage() {
    const context = useContext(AuthContext)
    let navigate = useNavigate();
    useEffect(() => {
        console.log("context", context.currentUser)
        if (context.currentUser === undefined) {
            navigate("/login")
        }
    }, [context.currentUser])

    return (
        <AlbumProvider>
            <AlbumPageFrame title="アルバム">
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <AlbumMenu />
                    </Grid>
                    <Grid item xs={8}>
                        <AlbumImageView />
                    </Grid>
                </Grid>
            </AlbumPageFrame >
        </AlbumProvider>
    );
}
