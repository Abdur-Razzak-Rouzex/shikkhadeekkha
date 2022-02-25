import moment from "moment";
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
import AdminMenuItems from "../../../components/admin/AdminMenuItems";
import {COURSE_TYPE} from "../../../components/common/constants";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

function AdminOrders() {
    const {state} = useContext(Store);
    const router = useRouter();

    const {userInfo} = state;

    const [{loading, error, orders}, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: '',
    });

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/admin/orders`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        };
        fetchData();
    }, [router, userInfo.name, userInfo.token]);
    return (
        <Layout title="Orders">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <AdminMenuItems activeItem="orders"/>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Orders
                                </Typography>
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
                                                    <TableCell>USER</TableCell>
                                                    <TableCell>DATE</TableCell>
                                                    <TableCell>TOTAL</TableCell>
                                                    <TableCell>PAID</TableCell>
                                                    <TableCell>DELIVERED</TableCell>
                                                    <TableCell>ACTION</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow key={order._id}>
                                                        <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                        <TableCell>
                                                            {order.user ? order.user.name : 'DELETED USER'}
                                                        </TableCell>
                                                        <TableCell>{moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                                                        <TableCell>{order.totalPrice} ৳</TableCell>
                                                        <TableCell>
                                                            {order.isPaid
                                                                ? `paid at ${moment(order?.paidAt).format('MMMM Do YYYY, h:mm:ss a')}`
                                                                : 'not paid'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {order.isDelivered
                                                                ? `Delivered at ${moment(order?.deliveredAt).format('MMMM Do YYYY, h:mm:ss a')}`
                                                                : order?.orderItems[0]?.type === COURSE_TYPE
                                                                    ? 'Delivered' : 'Not Delivered'
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/order/${order._id}`} passHref>
                                                                <Button variant="contained">Details</Button>
                                                            </NextLink>
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

export default dynamic(() => Promise.resolve(AdminOrders), {ssr: false});
