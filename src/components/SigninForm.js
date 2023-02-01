import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth'
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AlbumPageFrame from '../album/AlbumPageFrame'

function SigninForm() {
    let navigate = useNavigate();
    const context = useContext(AuthContext)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [error, setError] = useState();
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccess = await context.signin(formData.username, formData.email, formData.password)
        if (isSuccess) {
            navigate('/');
        } else {
            setError("サインインエラー");
        }
        setFormData({ username: '', password: '', email: '' });
    };

    return (
        <AlbumPageFrame title="サインイン">
            <Paper elevation={3} sx={{ width: 550 }}>
                <Container maxWidth="xs">
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} >
                            <Typography variant="h5" component="div">
                                サインイン
                        </Typography>
                            <FormControl variant="standard" onSubmit={handleSubmit}>
                                <InputLabel htmlFor="username">ユーザ名:</InputLabel>
                                <Input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl variant="standard" onSubmit={handleSubmit}>
                                <InputLabel htmlFor="email">Eメール:</InputLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl variant="standard" onSubmit={handleSubmit}>
                                <InputLabel htmlFor="password">パスワード:</InputLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <Button variant="contained" type="submit">登録</Button>
                            <p>{error}</p>
                            <br />
                        </Stack>
                    </form>
                </Container>
            </Paper>
        </AlbumPageFrame>
    );
}

export default SigninForm;
