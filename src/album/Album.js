import React, { createContext, useState, } from 'react';

export const AlbumContext = createContext();

export const AlbumProvider = (props) => {
    const [album, setAlbum] = useState({});

    return (
        <AlbumContext.Provider
            value={{
                setAlbum,
                album
            }}>
            {props.children}
        </AlbumContext.Provider>
    );
}
