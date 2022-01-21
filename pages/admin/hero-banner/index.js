import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext, useEffect, useReducer} from 'react';
import {
    Button,
    Card,
    CircularProgress,
    Grid,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {getError} from "../../../utils/error";
import {useSnackbar} from "notistack";
import AdminMenuItems from "../../../components/admin/AdminMenuItems";
import Layout from "../../../components/Layout";
import {Store} from "../../../utils/Store";
import classes from "../../../utils/classes";
import Image from 'next/image'

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, heroBanners: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true};
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true};
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false};
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false};
        default:
            return state;
    }
}

function AdminProdcuts() {
    const {state} = useContext(Store);
    const router = useRouter();

    const {userInfo} = state;

    const [
        {loading, error, heroBanners, successDelete, loadingDelete},
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: '',
    });

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/admin/hero-banner`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        };
        if (successDelete) {
            dispatch({type: 'DELETE_RESET'});
        } else {
            fetchData();
        }
    }, [router, successDelete, userInfo.name, userInfo.token]);

    const createHandler = async () => {
        await router.push('/admin/hero-banner/create');
    }

    const {enqueueSnackbar} = useSnackbar();

    const deleteHandler = async (heroBannerId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({type: 'DELETE_REQUEST'});
            await axios.delete(`/api/admin/hero-banner/${heroBannerId}`, {
                headers: {authorization: `Bearer ${userInfo.token}`},
            });

            dispatch({type: 'DELETE_SUCCESS'});
            enqueueSnackbar('Product deleted successfully', {variant: 'success'});
        } catch (err) {
            dispatch({type: 'DELETE_FAIL'});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    return (
        <Layout title="Hero Banners">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <AdminMenuItems activeItem="hero-banners"/>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography component="h1" variant="h1">
                                            Hero Banners
                                        </Typography>
                                        {loadingDelete && <CircularProgress/>}
                                    </Grid>
                                    <Grid align="right" item xs={6}>
                                        <Button
                                            onClick={createHandler}
                                            color="primary"
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </ListItem>

                            <ListItem>
                                {loading ? (
                                    <CircularProgress/>
                                ) : error ? (
                                    <Typography sx={classes.error}>{error}</Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Link</TableCell>
                                                    <TableCell>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {heroBanners.map((banner) => (
                                                    <TableRow key={banner._id}>
                                                        <TableCell>
                                                            <Image
                                                                src={banner.imgUrl}
                                                                alt="Cadet Coaching"
                                                                width={200}
                                                                height={100}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{banner.link}</TableCell>
                                                        <TableCell>
                                                            <NextLink
                                                                href={`/admin/hero-banner/${banner._id}`}
                                                                passHref
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="secondary"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </NextLink>{' '}
                                                            <Button
                                                                onClick={() => deleteHandler(banner._id)}
                                                                size="small"
                                                                variant="contained"
                                                                color="error"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminProdcuts), {ssr: false});
