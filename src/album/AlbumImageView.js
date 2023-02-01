import React, { useState, useEffect, useContext } from 'react';
import Masonry from '@mui/lab/Masonry';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SaveIcon from '@mui/icons-material/Save';
import { AlbumContext } from './Album'
import axios from 'axios';
import ShareIcon from '@mui/icons-material/Share';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CopyToClipBoard from 'react-copy-to-clipboard';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { generateRandomString } from './utils'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function AlbumImageView() {
    const context = useContext(AlbumContext)
    const [isLoading, setIsLoading] = useState(undefined);
    const [images, setImages] = useState([]);
    const [savedImg, setSavedImg] = useState([]);
    const [random, setRandom] = useState(generateRandomString());
    const [open, setOpen] = useState(false)
    const handleClick = () => document.getElementById('file_upload').click();
    const handleChange = (e) => {
        console.log(e.target.files)
        setImages(Array.from(e.target.files));
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false)
    }

    useEffect(() => {
        getAlbumImages()
        setRandom(generateRandomString())
    }, [context.album]);


    // 画像データimagesをサーバにアップロードし、保存パスなどの画像情報をDBに送信する
    function handleUpload() {
        setIsLoading(true)
        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        formData.append('id', context.album.id);
        // 画像データをアップロード
        axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/album/image/upload`, formData)
            .then(data => {
                console.log(data.data.files);
                const files = data.data.files
                // 画像情報をDBに送信
                files.forEach(album => {
                    axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/album/image`, {
                        name: album.filename,
                        mimetype: album.mimetype,
                        albumId: context.album.id,
                        savedAt: album.path.replace("/root/album/public", "")
                    }).then(_ => {
                        getAlbumImages()
                        setImages([])
                    }).catch(err => {
                        console.log(err)
                    })
                })
                setIsLoading(false)
            }).catch(err => {
                console.log(err)
            });
    }

    // アルバムIDからアルバムの写真を取得し,savedImgに書きこむ
    function getAlbumImages() {
        if (context.album.id !== undefined & context.album.id !== "") {
            axios.get(`${process.env.REACT_APP_ALBUM_SERVER}/album/image?albumId=${context.album.id}`, {
            })
                .then(data => {
                    setSavedImg(data.data);
                    setImages([]);
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    // 共有コードをDBに登録する
    const handleShare = () => {
        axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/album/share`, {
            albumId: context.album.id,
            sharecode: random
        })
            .then(data => {
                setOpen(true)
            }).catch(err => {
                console.log(err)
            })
    }

    const breadcrumbs = [
        <Typography key="3" color="text.secondary">
            アルバム
        </Typography>,
        <Typography key="3" color="text.secondary">
            {context.album.name}
        </Typography>,
    ]
    return (
        <>
            {
                context.album.id === undefined ? (undefined
                ) : (
                        <Container maxWidth="xl" >
                            <Stack spacing={2} justifyContent="center" alignItems="center">
                                <div style={{ width: "100%" }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={2}>
                                        <Breadcrumbs
                                            separator={<NavigateNextIcon fontSize="small" />}
                                            aria-label="breadcrumb"
                                        >
                                            {breadcrumbs}
                                        </Breadcrumbs>
                                        <div>
                                            {images.length > 0 ? (
                                                <Fab color="primary" variant="extended" onClick={handleUpload}>
                                                    保存<SaveIcon />
                                                </Fab>
                                            ) : (undefined)}
                                            <input style={{ display: "none" }} id="file_upload" type="file" multiple accept=".png, .jpg, .PNG, .JPG, .jpeg, .JPEG ,.mov, .mp4" onChange={handleChange} />
                                        </div>
                                        {context.album.editable && (
                                            <div>
                                                <Chip
                                                    label="共有"
                                                    onClick={handleMenu}
                                                    deleteIcon={<ShareIcon />}
                                                    variant="outlined"
                                                />
                                                <Menu
                                                    id="menu-appbar"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem><Button variant="contained" onClick={handleShare}>共有コードを生成</Button></MenuItem>
                                                    {open ? (
                                                        <MenuItem>
                                                            <OutlinedInput
                                                                type='text'
                                                                value={random}
                                                                disabled
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <CopyToClipBoard text={random}>
                                                                            <IconButton>
                                                                                <AssignmentIcon />
                                                                            </IconButton>
                                                                        </CopyToClipBoard>
                                                                    </InputAdornment>}
                                                            ></OutlinedInput>
                                                        </MenuItem>
                                                    ) : (undefined)}
                                                </Menu>
                                            </div>
                                        )}

                                    </Stack>
                                </div>
                                {isLoading && <CircularProgress />}
                                <Masonry columns={3} spacing={2} sx={{ backgroundColor: "#eee" }}>
                                    {
                                        savedImg.map((image, index) => (
                                            image.mimetype === 'video/mp4' | image.type === 'video/quicktime' ? (
                                                <video controls width='250' src={image.saved_at} ></video>
                                            ) : (
                                                    <img key={index} src={image.saved_at} alt="ALT"
                                                        style={{
                                                            borderBottomLeftRadius: 4,
                                                            borderBottomRightRadius: 4,
                                                            display: 'block',
                                                            width: '29%',
                                                            maxWidth: '250px'
                                                        }} />
                                                )
                                        ))}
                                    {
                                        images.length === 0 && context.album.editable && (<img key="index" src="/addImageIcon2.png" alt="ALT"
                                            style={{
                                                borderBottomLeftRadius: 4,
                                                borderBottomRightRadius: 4,
                                                display: 'block',
                                                width: '29%',
                                                maxWidth: '250px'
                                            }} onClick={handleClick} />)
                                    }
                                    {
                                        images.map((image, index) => (
                                            image.type === 'video/mp4' | image.type === 'video/quicktime' ? (
                                                <video controls width='250' src={URL.createObjectURL(image)} >
                                                </video>
                                            ) : (
                                                    <img key={index} src={URL.createObjectURL(image)} alt="ALT"
                                                        style={{
                                                            borderBottomLeftRadius: 4,
                                                            borderBottomRightRadius: 4,
                                                            display: 'block',
                                                            width: '29%',
                                                            maxWidth: '250px'
                                                        }} />)
                                        ))}
                                </Masonry>
                            </Stack>
                        </Container >
                    )
            }
        </>
    );
}
