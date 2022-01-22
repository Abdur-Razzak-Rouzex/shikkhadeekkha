import Head from 'next/head';
import {Container, CssBaseline, ThemeProvider} from '@mui/material';

import {createTheme} from '@mui/material/styles';
import React, {useContext} from 'react';
import classes from '../utils/classes';

import {Store} from '../utils/Store';
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({title, description, children}) {
    const {state} = useContext(Store);
    const {darkMode} = state;

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
            error: {
                main: '#d32f2f',
            },
            warning: {
                main: '#ED6C02',
            },
        },
    });

    return (
        <>
            <Head>
                <title>{title ? `${title} - শিক্ষাদীক্ষা` : 'শিক্ষাদীক্ষা'}</title>
                {description && <meta name="description" content={description}/>}
            </Head>

            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header/>

                <Container component="main" sx={classes.main}>
                    {children}
                </Container>

                <Footer/>
            </ThemeProvider>
        </>
    );
}
