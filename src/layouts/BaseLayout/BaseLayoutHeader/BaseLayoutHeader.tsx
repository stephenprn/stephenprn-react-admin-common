import { Box, AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import './BaseLayoutHeader.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaults } from 'mande';

const routesPathNamesMap: {
    [pathname: string]: string;
} = {
    '/admin/users': 'Users',
    '/admin/shops': 'Shops',
};

export const BaseLayoutHeader: React.FC = () => {
    // logout functions

    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        defaults.headers.Authorization = '';
        navigate('/login');
    };

    // menu functions

    const [menuAnchorElt, setMenuAnchorElt] = React.useState<null | HTMLElement>(null);
    const menuOpened = Boolean(menuAnchorElt);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorElt(event.currentTarget);
    };
    const closeMenu = () => {
        setMenuAnchorElt(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={openMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={menuAnchorElt}
                        open={menuOpened}
                        onClose={closeMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => navigate('/admin/users')}>Users</MenuItem>
                        <MenuItem onClick={() => navigate('/admin/shops')}>Shops</MenuItem>
                    </Menu>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {location.pathname in routesPathNamesMap ? routesPathNamesMap[location.pathname] : 'Admin'}
                    </Typography>
                    <Button color="inherit" onClick={() => logout()}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};
