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

type IMenuItem = {
    text: string,
    onClick?: () => void
}

const MenuAppBar = () => {
    const auth = useAppSelector(getAuthStatus);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const location = useLocation();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const reload = () => {
        queryClient.invalidateQueries();
    }

    const redirect = (path: string) => {
        navigate(path);
        handleClose();
    }

    const settingMenuItemMap = new Map<string, Array<string>>([
        ["/", ["refresh", "settings", "logout"]],
        ["/settings", ["logout"]]
    ])

    const menuItemArray = new Map<string, IMenuItem>([
        ["refresh",
            {
                text: "Refresh",
                onClick: reload
            },
        ],
        ["settings",
            {
                text: "Settings",
                onClick: () => redirect("/settings")
            },
        ],
        ["logout",
            {
                text: "Logout",
                onClick: logout
            },
        ]
    ]);

    const menuItems = getMenuItems(location.pathname, settingMenuItemMap, menuItemArray);

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
                                {
                                    menuItems.map(menuItem => <MenuItem onClick={menuItem.onClick} key={menuItem.text}>{menuItem.text}</MenuItem>)
                                }
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box >
    );
}

const getMenuItems = (path: string, settingMenuItemMap: Map<string, Array<string>>, menuItemArray: Map<string, IMenuItem>): Array<IMenuItem> => {
    let menuItems: Array<IMenuItem> = [];
    const items = settingMenuItemMap.get(path);
    items?.forEach(id => {
        if (menuItemArray.has(id)) {
            menuItems.push(menuItemArray.get(id)!);
        }
    })
    return menuItems;
}


export default MenuAppBar;