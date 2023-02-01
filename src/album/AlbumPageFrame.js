import React from 'react';
import AppBar from './AppBar'
import Stack from '@mui/material/Stack';


function AlbumPageFrame(props) {
    return (
        <div>
            <Stack spacing={2}>
                <AppBar title={props.title} sx={{ width: "100%" }} />
                <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                    {props.children}
                </div>
            </Stack>
        </div >
    );
}

export default AlbumPageFrame;
