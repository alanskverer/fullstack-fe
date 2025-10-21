import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert, IconButton, Tooltip, InputAdornment } from '@mui/material';
import { Home as HomeIcon, Visibility, VisibilityOff } from '@mui/icons-material';
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
    const [showPassword, setShowPassword] = useState(false)

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
            {/* Home Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
                <Tooltip title="Back to Home">
                    <IconButton
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#666',
                            '&:hover': {
                                color: 'white'
                            }
                        }}
                    >
                        <HomeIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(120, 119, 198, 0.05), rgba(255, 119, 198, 0.05))',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-20px) rotate(180deg)' }
                    }
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    right: '15%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(120, 219, 255, 0.05), rgba(255, 119, 198, 0.05))',
                    animation: 'float 8s ease-in-out infinite reverse',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-20px) rotate(180deg)' }
                    }
                }}
            />
            <Paper elevation={3} className="login-card" sx={{ 
                position: 'relative', 
                zIndex: 1,
                backgroundColor: '#e0e0e0'
            }}>
                <Typography variant="h4" gutterBottom sx={{ 
                    color: '#333', 
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 3
                }}>
                    Admin Login
                </Typography>
                <form className="login-form" onSubmit={handleSubmit}>
                    <TextField 
                        label="Password" 
                        type={showPassword ? "text" : "password"}
                        fullWidth 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!error}
                        disabled={isPending}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePasswordVisibility}
                                        edge="end"
                                        sx={{ color: '#666' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                '& input': {
                                    color: '#333 !important',
                                    WebkitTextFillColor: '#333 !important',
                                    backgroundColor: '#f5f5f5',
                                }
                            }
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: '#ddd',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#999',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#333',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                                '&.Mui-focused': {
                                    color: '#333',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: '#333 !important',
                                WebkitTextFillColor: '#333 !important',
                                caretColor: '#333 !important',
                            },
                        }}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth
                        disabled={isPending}
                        sx={{ 
                            mt: 2,
                            backgroundColor: 'white',
                            color: '#000',
                            fontWeight: 600,
                            fontSize: '1rem',
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                            '&:disabled': {
                                backgroundColor: '#555',
                                color: '#999',
                            }
                        }}
                    >
                        {isPending ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};
