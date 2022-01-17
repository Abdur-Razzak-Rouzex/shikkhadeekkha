import Head from 'next/head';
import {
    AppBar,
    Badge,
    Box,
    Container,
    CssBaseline,
    IconButton,
    InputBase,
    Link,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material';

import {createTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {useContext, useState} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import classes from '../utils/classes';
import Cookies from 'js-cookie';
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
                    underline: 'none',
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

    const [query, setQuery] = useState('');
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
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

                        {/** search bar */}
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

                        {/** navbar right side */}
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
                    </Toolbar>
                </AppBar>

                <Container component="main" sx={classes.main}>
                    {children}
                </Container>

                <Box component="footer" sx={classes.footer}>
                    <Typography>All rights reserved. ShikkhaDeekkha.</Typography>
                </Box>

            </ThemeProvider>
        </>
    );
}
