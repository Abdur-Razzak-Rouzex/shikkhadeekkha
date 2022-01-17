import Head from 'next/head';
import {
    AppBar,
    Badge,
    Box,
    Container,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemText,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';

import {createTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {useContext, useEffect, useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import classes from '../utils/classes';
import {getError} from '../utils/error';
import Cookies from 'js-cookie';
import {useSnackbar} from 'notistack';
import axios from 'axios';
import {useRouter} from 'next/router';
import NextLink from 'next/link';

import {Store} from '../utils/Store';

export default function Layout({title, description, children}) {
    const {state, dispatch} = useContext(Store);
    const {darkMode, cart, userInfo} = state;

    const theme = createTheme({
        components: {
            MuiLink: {
                defaultProps: {
                    underline: 'hover',
                },
            },
        },

        typography: {
            h1: {
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
        },
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#f0c000',
            },
            secondary: {
                main: '#208080',
            },
        },
    });

    const router = useRouter();

    const [sidbarVisible, setSidebarVisible] = useState(false);
    const sidebarOpenHandler = () => {
        setSidebarVisible(true);
    };

    const sidebarCloseHandler = () => {
        setSidebarVisible(false);
    };

    const [categories, setCategories] = useState([]);
    const {enqueueSnackbar} = useSnackbar();

    const fetchCategories = async () => {
        try {
            const {data} = await axios.get(`/api/products/categories`);
            setCategories(data);
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    const [query, setQuery] = useState('');
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const darkModeChangeHandler = () => {
        dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    const isDesktop = useMediaQuery('(min-width:600px)');
    return (
        <>
            <Head>
                <title>{title ? `${title} - শিক্ষাদীক্ষা` : 'শিক্ষাদীক্ষা'}</title>
                {description && <meta name="description" content={description}/>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar position="static" sx={classes.appbar}>
                    <Toolbar sx={classes.toolbar}>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                edge="start"
                                aria-label="open drawer"
                                onClick={sidebarOpenHandler}
                                sx={classes.menuButton}
                            >
                                <MenuIcon sx={classes.navbarButton}/>
                            </IconButton>
                            <NextLink href="/" passHref>
                                <Link style={{textDecoration: 'none'}}>
                                    <Typography sx={classes.brand}>শিক্ষাদীক্ষা</Typography>
                                    <Typography variant='span' sx={{fontSize: 12, marginLeft: '22px'}}>মননে সৃষ্টির
                                        বিকাশ</Typography>
                                </Link>
                            </NextLink>
                        </Box>
                        <Drawer
                            anchor="left"
                            open={sidbarVisible}
                            onClose={sidebarCloseHandler}
                        >
                            <List>
                                <ListItem>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Typography>Shopping by category</Typography>
                                        <IconButton
                                            aria-label="close"
                                            onClick={sidebarCloseHandler}
                                        >
                                            <CancelIcon/>
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <Divider light/>
                                {categories.map((category) => (
                                    <NextLink
                                        key={category}
                                        href={`/search?category=${category}`}
                                        passHref
                                    >
                                        <ListItem
                                            button
                                            component="a"
                                            onClick={sidebarCloseHandler}
                                        >
                                            <ListItemText primary={category}/>
                                        </ListItem>
                                    </NextLink>
                                ))}
                            </List>
                        </Drawer>

                        <Box sx={isDesktop ? classes.visible : classes.hidden}>
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
                        <Box>
                            <Switch
                                checked={darkMode}
                                onChange={darkModeChangeHandler}
                            />
                            <NextLink href="/cart" passHref>
                                <Link style={{textDecoration: 'none'}}>
                                    <Typography component="span">
                                        {cart.cartItems.length > 0 ? (
                                            <Badge
                                                color="secondary"
                                                badgeContent={cart.cartItems.length}
                                            >
                                                Cart
                                            </Badge>
                                        ) : (
                                            'Cart'
                                        )}
                                    </Typography>
                                </Link>
                            </NextLink>
                            {userInfo ? (
                                <>
                                    <NextLink href="/profile" passHref>
                                        <Link style={{textDecoration: 'none'}}>
                                            <Typography component="span">{userInfo.name}</Typography>
                                        </Link>
                                    </NextLink>
                                    {userInfo.isAdmin && (
                                        <NextLink href="/admin/dashboard" passHref>
                                            <Link style={{textDecoration: 'none'}}>
                                                <Typography component="span">Admin Dashboard</Typography>
                                            </Link>
                                        </NextLink>
                                    )}
                                </>
                            ) : (
                                <NextLink href="/login" passHref>
                                    <Link style={{textDecoration: 'none'}}>
                                        <Typography component="span">Login</Typography>
                                    </Link>
                                </NextLink>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container component="main" sx={classes.main}>
                    {children}
                </Container>
                <Box component="footer" sx={classes.footer}>
                    <Typography>All rights reserved. Next Amazona.</Typography>
                </Box>
            </ThemeProvider>
        </>
    );
}
