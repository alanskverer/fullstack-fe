import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { useLogin } from "./Login.lib";

type LoginProps = {
    onLogin: ()=> void
}

export const Login = (props:LoginProps) => {
    const navigate = useNavigate();
    const { mutate:login } = useLogin()
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        if (!password) return;

        login(password, {
            onSuccess: () => {
                props.onLogin(); //
                navigate('/dashboard');
            },
            onError: () => alert('wrong password'),
        });
    };

    return (
        <Box className="login-wrapper">
            <Paper elevation={3} className="login-card">
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form className="login-form" onSubmit={handleSubmit}>
                    <TextField label="Password" type="password" fullWidth margin="normal"
                               onChange={(e) => setPassword(e.target.value)}/>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign In
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};
