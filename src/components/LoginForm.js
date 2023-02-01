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
import AlbumPageFrame from '../album/AlbumPageFrame';

function LoginForm() {
    let navigate = useNavigate();
    const context = useContext(AuthContext)
    const [formData, setFormData] = useState({
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
        const isSuccess = await context.login(formData.email, formData.password);
        if (isSuccess) {
            navigate("/album");
        } else {
            setError("ユーザ名かパスワードが違います");
        }
        setFormData({ password: '', email: '' });
    };

    return (
        <AlbumPageFrame title="ログイン">
            <Paper elevation={3} sx={{ width: 550 }}>
                <Container maxWidth="xs">
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2} >
                            <Typography variant="h5" component="div">
                                ログイン
                            </Typography>
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
                            <Button variant="contained" type="submit">ログイン</Button>
                            <p>{error}</p>
                            <br />
                        </Stack>
                    </form>
                </Container>
            </Paper>
        </AlbumPageFrame>
    );
}

export default LoginForm;
