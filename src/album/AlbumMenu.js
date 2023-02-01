import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AuthContext } from '../components/Auth'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlbumContext } from './Album'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '1px solid #EEE',
    boxShadow: 4,
    p: 4,
};

export default function AlbumMenu() {
    const context = useContext(AuthContext)
    const contextAlbum = useContext(AlbumContext)
    const [album, setAlbum] = useState([]);
    const [dldAlbum, setDldAlbum] = useState([]);
    const [open, setOpen] = useState(false);
    const [opend, setOpend] = useState(false);
    const [mopen, setMopen] = React.useState(false);
    const [error, setError] = useState("");;
    const [formData, setFormData] = useState({ name: "" });
    const [shareForm, setShareForm] = useState(undefined);

    const handleMopen = () => setMopen(true);
    const handleMclose = () => setMopen(false);
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDownloadOpen = () => setOpend(true);
    const handleClosed = () => setOpend(false);
    const handleSelectAlbum = (album) => contextAlbum.setAlbum(album)

    useEffect(() => {
        getMyAlbum()
    }, []);

    // ユーザIDからユーザの持つアルバムを取得し、albumに書きこむ
    // 共有コードからダウンロードしたアルバムも取得し、dldAlbumに書きこむ
    const getMyAlbum = async () => {
        if (context.currentUser !== undefined) {
            const res = await axios.get(`${process.env.REACT_APP_ALBUM_SERVER}/album?userId=${context.currentUser.id}`, {}).catch(err => {
                console.log(err)
            });
            setAlbum(res.data)
            const res2 = await axios.get(`${process.env.REACT_APP_ALBUM_SERVER}/album/download?userId=${context.currentUser.id}`, {}).catch(err => {
                console.log(err)
            });
            setDldAlbum(res2.data)
        }
    }

    // 新規アルバム用のフォームデータ
    const handleChangeForm = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    // 共有コード入力用のフォームデータ
    const handleChangeShareForm = (event) => {
        setShareForm({
            ...shareForm,
            [event.target.name]: event.target.value,
        });
    };

    // 新しいアルバムをDBに登録する
    const handleCreateAlbum = async (event) => {
        event.preventDefault();
        if (context.currentUser !== null & formData.name !== "") {
            await axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/album`, {
                userId: context.currentUser.id,
                name: formData.name,
            });
            setOpen(false);
            getMyAlbum()
        } else {
            setError("アルバム名が必要です")
        }
    }

    // アルバムの削除を行う
    function handleDelete() {
        axios.put(`${process.env.REACT_APP_ALBUM_SERVER}/album?albumId=${contextAlbum.album.id}`, {
        })
            .then(data => {
                setMopen(false)
                contextAlbum.setAlbum({})
                getMyAlbum()
            }).catch(err => {
                console.log(err)
            })
    }

    // 共有コードからアルバムをダウンロードする
    function handleDownloadAlbum(event) {
        event.preventDefault();
        if (context.currentUser !== null & shareForm.sharecode !== "") {
            axios.post(`${process.env.REACT_APP_ALBUM_SERVER}/album/share/download`, {
                userId: context.currentUser.id,
                sharecode: shareForm.sharecode,
            }).then(data => {
                if (data.data.length > 0) alert(data.data[0])
                setOpend(false);
                getMyAlbum()
            }).catch(err => {
                console.log(err)
            });
        }
    }

    return (
        <>
            <List>
                <Divider textAlign="center"><small>アルバム</small></Divider>
                <ListItem >
                    <ListItemButton onClick={handleClickOpen} >
                        <ListItemText primary="新しいアルバムを作成" />
                        <NavigateNextIcon />
                    </ListItemButton>
                </ListItem>
                {
                    album.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemButton onClick={() => handleSelectAlbum({ ...item, editable: true })}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.name} secondary={item.created_at} />
                                <IconButton aria-label="delete" size="large" onClick={handleMopen}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemButton>
                        </ListItem>
                    )
                    )
                }
                <Modal
                    open={mopen}
                    onClose={handleMclose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            本当に削除しますか
                                        </Typography>
                        <Button onClick={handleMclose}>キャンセル</Button>
                        <Button onClick={handleDelete}>実行</Button>
                    </Box>
                </Modal>
                <Divider textAlign="center"><small>ダウンロードしたアルバム</small></Divider>
                <ListItem >
                    <ListItemButton onClick={handleDownloadOpen}>
                        <ListItemText primary="アルバムをダウンロードする" />
                        <NavigateNextIcon />
                    </ListItemButton>
                </ListItem>

                {
                    dldAlbum.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemButton onClick={() => handleSelectAlbum({ ...item, editable: false })}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.name} secondary={item.created_at} />
                            </ListItemButton>
                        </ListItem>
                    )
                    )
                }
            </List>

            <Dialog open={open} onClose={handleClose}>
                <form >
                    <DialogTitle>アルバム名を入力</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {error}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            name="name"
                            label="アルバム名"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleChangeForm}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>キャンセル</Button>
                        <Button type="submit" onClick={handleCreateAlbum}>作成</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={opend} onClose={handleClosed}>
                <form >
                    <DialogTitle>共有コードを入力する</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            name="sharecode"
                            label="共有コード"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleChangeShareForm}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosed}>キャンセル</Button>
                        <Button type="submit" onClick={handleDownloadAlbum}>ダウンロード</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
