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
import {getError} from '../../../utils/error';
import {Store} from '../../../utils/Store';
import Layout from '../../../components/Layout';
import classes from '../../../utils/classes';
import {useSnackbar} from 'notistack';
import AdminMenuItems from "../../../components/admin/AdminMenuItems";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, users: action.payload, error: ''};
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

function AdminUsers() {
    const {state} = useContext(Store);
    const router = useRouter();

    const {userInfo} = state;

    const [{loading, error, users, successDelete, loadingDelete}, dispatch] =
        useReducer(reducer, {
            loading: true,
            users: [],
            error: '',
        });

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/admin/users`, {
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

    const {enqueueSnackbar} = useSnackbar();

    const deleteHandler = async (userId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({type: 'DELETE_REQUEST'});
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: {authorization: `Bearer ${userInfo.token}`},
            });
            dispatch({type: 'DELETE_SUCCESS'});
            enqueueSnackbar('User deleted successfully', {variant: 'success'});
        } catch (err) {
            dispatch({type: 'DELETE_FAIL'});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };
    return (
        <Layout title="Users">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <AdminMenuItems activeItem='users'/>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Users
                                </Typography>
                                {loadingDelete && <CircularProgress/>}
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
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>NAME</TableCell>
                                                    <TableCell>EMAIL</TableCell>
                                                    <TableCell>ISADMIN</TableCell>
                                                    <TableCell>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user._id}>
                                                        <TableCell>{user._id.substring(20, 24)}</TableCell>
                                                        <TableCell>{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.isAdmin ? 'YES' : 'NO'}</TableCell>
                                                        <TableCell>
                                                            <NextLink
                                                                href={`/admin/users/${user._id}`}
                                                                passHref
                                                            >
                                                                <Button size="small" variant="contained">
                                                                    Edit
                                                                </Button>
                                                            </NextLink>{' '}
                                                            <Button
                                                                onClick={() => deleteHandler(user._id)}
                                                                size="small"
                                                                variant="contained"
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

export default dynamic(() => Promise.resolve(AdminUsers), {ssr: false});
