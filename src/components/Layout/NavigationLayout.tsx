import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    Container,

} from '@mui/material';
import {
    SportsTennis as SportsIcon,
    AccountCircle,
    Settings,
    Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const navigationItems = [
    {
        label: 'Events',
        path: '/dashboard',
        icon: <SportsIcon />,
        description: 'Manage NBA events'
    }
];

interface NavigationLayoutProps {
    onLogout: () => void;
}

export const NavigationLayout = ({ onLogout }: NavigationLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        onLogout();
        navigate('/', { replace: true });
    };

    const isMenuOpen = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="fixed" elevation={1}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Logo and Brand */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SportsIcon sx={{ fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Bettim Admin
                            </Typography>
                        </Box>

                        {/* Navigation Items */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {navigationItems.map((item) => (
                                <Button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    startIcon={item.icon}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
                                        borderRadius: 2,
                                        px: 2,
                                        py: 1,
                                        position: 'relative'
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Profile Menu */}
                        <Box>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    sx={{ color: 'white' }}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <AccountCircle />
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={isMenuOpen}
                                onClose={handleProfileMenuClose}
                                onClick={handleProfileMenuClose}
                                PaperProps={{
                                    elevation: 2,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 24,
                                            height: 24,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleProfileMenuClose} disabled>
                                    <Settings fontSize="small" sx={{ mr: 1 }} />
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Logout fontSize="small" sx={{ mr: 1 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50', pt: { xs: '56px', sm: '64px' }, minHeight: 0 }}>
                <Outlet />
            </Box>
        </Box>
    );
}; 