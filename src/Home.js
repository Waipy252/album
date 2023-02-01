import {
  Link,
} from "react-router-dom";
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
/* eslint no-unused-expressions: "off" */

const Home = () => {
  return (
    <>

      <Box
        sx={{ width: "auto" }}
        role="presentation"
      >
        <List>
          {
            homeList.map(item => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <Link to={item.link} ><ListItemText primary={item.title} /></Link>
                </ListItemButton>
              </ListItem>
            )
            )
          }
        </List>
      </Box>
    </>
  )
};


const homeList = [
  {
    title: "アルバム",
    link: "/album/",
    icon: <PhotoLibraryIcon />,
  },
]
export default Home;