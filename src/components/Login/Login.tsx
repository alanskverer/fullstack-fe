import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { useLogin } from "./Login.lib";

type LoginProps = {
    onLogin: ()=> void
}

export const Login = (props:LoginProps) => {
    const navigate = useNavigate();
    const { mutate:login, isPending } = useLogin()
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!password) {
            setError("Password is required");
            return;
        }

        login(password, {
            onSuccess: () => {
                props.onLogin();
                navigate('/admin/dashboard');
            },
            onError: () => setError('Invalid password. Please try again.'),
        });
    };

    return (
        <Box className="login-wrapper">
            <Paper elevation={3} className="login-card">
                <Typography variant="h5" gutterBottom>
                    Admin Login
                </Typography>
                <form className="login-form" onSubmit={handleSubmit}>
                    <TextField 
                        label="Password" 
                        type="password" 
                        fullWidth 
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error}
                        disabled={isPending}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        disabled={isPending}
                        sx={{ mt: 2 }}
                    >
                        {isPending ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};
