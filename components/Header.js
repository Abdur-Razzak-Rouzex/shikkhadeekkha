import classes from "../utils/classes";
import {
    AppBar,
    Badge,
    Box,
    Drawer,
    Hidden,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch,
    Toolbar,
    Typography
} from "@mui/material";
import NextLink from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import React, {useContext, useState} from "react";
import Cookies from "js-cookie";
import {useRouter} from "next/router";
import {Store} from "../utils/Store";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';

const Header = () => {
    const {state, dispatch} = useContext(Store);
    const {darkMode, cart, userInfo} = state;

    const [query, setQuery] = useState('');
    const router = useRouter();

    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };

    const redirectTo = (path) => {
        router.push(path);
        setShowDrawer(false);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    const darkModeChangeHandler = () => {
        dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    const [showDrawer, setShowDrawer] = useState(false);

    return (
        <header>
            <AppBar position="static" sx={classes.appbar}>
                <Toolbar sx={classes.toolbar}>
                    {/** navbar left side */}
                    <Box display="flex" alignItems="center">
                        <NextLink href="/" passHref>
                            <Link>
                                <Typography sx={classes.brand}>শিক্ষাদীক্ষা</Typography>
                                <Typography variant='span' sx={{fontSize: 12, marginLeft: '22px'}}>মননে সৃষ্টির
                                    বিকাশ</Typography>
                            </Link>
                        </NextLink>
                    </Box>

                    <Hidden mdUp>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setShowDrawer(true)}>
                            <MenuIcon sx={{color: 'white'}}/>
                        </IconButton>
                    </Hidden>

                    {/** search bar */}
                    <Hidden smDown>
                        <Box mx="auto">
                            <form onSubmit={submitHandler}>
                                <Box sx={classes.searchForm}>
                                    <InputBase
                                        name="query"
                                        sx={classes.searchInput}
                                        placeholder="Search products"
                                        onChange={queryChangeHandler}
                                    />
                                    <IconButton
                                        type="submit"
                                        sx={classes.searchButton}
                                        aria-label="search"
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </Box>
                            </form>
                        </Box>
                    </Hidden>

                    {/** navbar right side */}
                    <Hidden smDown>
                        <Box>
                            <Switch
                                checked={darkMode}
                                onChange={darkModeChangeHandler}
                            />
                            <NextLink href="/cart" passHref>
                                <Link>
                                    <Typography component="span">
                                        {cart.cartItems.length > 0 ? (
                                            <Badge
                                                color="secondary"
                                                badgeContent={cart.cartItems.length}
                                            >
                                                <ShoppingCartIcon/>
                                            </Badge>
                                        ) : (
                                            'Cart'
                                        )}
                                    </Typography>
                                </Link>
                            </NextLink>
                            <NextLink href="/about-us" passHref>
                                <Link>
                                    <Typography component="span">
                                        About Us
                                    </Typography>
                                </Link>
                            </NextLink>
                            {userInfo ? (
                                <>
                                    <NextLink href="/profile" passHref>
                                        <Link>
                                            <Typography component="span">{userInfo.name}</Typography>
                                        </Link>
                                    </NextLink>
                                    {userInfo.isAdmin && (
                                        <NextLink href="/admin/dashboard" passHref>
                                            <Link>
                                                <Typography component="span">Admin Dashboard</Typography>
                                            </Link>
                                        </NextLink>
                                    )}
                                </>
                            ) : (
                                <NextLink href="/login" passHref>
                                    <Link>
                                        <Typography component="span">Login</Typography>
                                    </Link>
                                </NextLink>
                            )}
                        </Box>
                    </Hidden>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={showDrawer}
                onClose={() => setShowDrawer(false)}>
                <List>
                    <ListItem>
                        <form onSubmit={submitHandler}>
                            <Box sx={classes.searchForm}>
                                <InputBase
                                    name="query"
                                    sx={classes.searchInput}
                                    placeholder="Search products"
                                    onChange={queryChangeHandler}
                                />
                                <IconButton
                                    type="submit"
                                    sx={classes.searchButton}
                                    aria-label="search"
                                >
                                    <SearchIcon/>
                                </IconButton>
                            </Box>
                        </form>
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'}/>
                        <ListItemIcon>
                            <Switch
                                checked={darkMode}
                                onChange={darkModeChangeHandler}
                            />
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button onClick={() => redirectTo('/')}>
                        <ListItemText primary="Home"/>
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button onClick={() => redirectTo('/cart')}>
                        <ListItemText primary="Cart"/>
                        <ListItemIcon>
                            {cart.cartItems.length > 0 ? (
                                <Badge
                                    color="secondary"
                                    badgeContent={cart.cartItems.length}
                                >
                                    <ShoppingCartIcon/>
                                </Badge>
                            ) : (
                                <ShoppingCartIcon/>
                            )}
                        </ListItemIcon>
                    </ListItem>
                    {userInfo ? (
                        <>
                            <ListItem button onClick={() => redirectTo('/profile')}>
                                <ListItemText primary={userInfo.name}/>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                            </ListItem>
                            {userInfo.isAdmin && (
                                <ListItem button onClick={() => redirectTo('/admin/dashboard')}>
                                    <ListItemText primary="Admin Dashboard"/>
                                    <ListItemIcon>
                                        <DashboardIcon/>
                                    </ListItemIcon>
                                </ListItem>
                            )}
                        </>
                    ) : (
                        <ListItem button onClick={() => redirectTo('/login')}>
                            <ListItemText primary="Login"/>
                            <ListItemIcon>
                                <LoginIcon/>
                            </ListItemIcon>
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </header>
    )
}

export default Header;