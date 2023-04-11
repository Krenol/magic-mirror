import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { getAuthStatus } from '../auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import { logout } from '../../apis/logout';
import { useQueryClient } from 'react-query';
import { useNavigate, useLocation } from "react-router-dom";

const MenuAppBar = () => {
    const auth = useAppSelector(getAuthStatus);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const reload = () => {
        queryClient.invalidateQueries();
    }

    const redirect = () => {
        navigate('/settings');
        handleClose();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Magic Mirror
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={reload}>Refresh</MenuItem>
                                <MenuItem onClick={redirect} disabled={location.pathname === '/settings'}>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box >
    );
}

export default MenuAppBar;