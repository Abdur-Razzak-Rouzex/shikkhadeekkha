import React, {useContext, useEffect, useReducer} from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import {Store} from '../../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import moment from "moment";
import {
    Button,
    Card,
    Chip,
    CircularProgress,
    Grid,
    Link,
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
import axios from 'axios';
import {useRouter} from 'next/router';
import classes from '../../utils/classes';
import {useSnackbar} from 'notistack';
import {getError} from '../../utils/error';
/*import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';*/
import {COURSE_TYPE} from "../../components/common/constants";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        case 'PAY_REQUEST':
            return {...state, loadingPay: true};
        case 'PAY_SUCCESS':
            return {...state, loadingPay: false, successPay: true};
        case 'PAY_FAIL':
            return {...state, loadingPay: false, errorPay: action.payload};
        case 'PAY_RESET':
            return {...state, loadingPay: false, successPay: false, errorPay: ''};
        case 'DELIVER_REQUEST':
            return {...state, loadingDeliver: true};
        case 'DELIVER_SUCCESS':
            return {...state, loadingDeliver: false, successDeliver: true};
        case 'DELIVER_FAIL':
            return {...state, loadingDeliver: false, errorDeliver: action.payload};
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
                errorDeliver: '',
            };
        default:
            return state;
    }
}

function Order({params}) {
    const orderId = params.id;
    /*const [{isPending}, paypalDispatch] = usePayPalScriptReducer();*/

    const router = useRouter();
    const {state} = useContext(Store);
    const {userInfo} = state;

    const [
        {loading, error, order, successPay, loadingDeliver, successDeliver},
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
    });

    const {
        shippingAddress,
        paymentMethod,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;

    useEffect(() => {
        if (!userInfo?.name) {
            return router.push('/login');
        }

        const fetchOrder = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/orders/${orderId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err)});
            }
        };

        if (
            !order._id ||
            successPay ||
            successDeliver ||
            (order._id && order._id !== orderId)
        ) {
            fetchOrder();
            if (successPay) {
                dispatch({type: 'PAY_RESET'});
            }
            if (successDeliver) {
                dispatch({type: 'DELIVER_RESET'});
            }
        }
    }, [order, successPay, successDeliver]);

    const {enqueueSnackbar} = useSnackbar();

    /*    function createOrder(data, actions) {
            return actions.order
                .create({
                    purchase_units: [
                        {
                            amount: {value: totalPrice},
                        },
                    ],
                })
                .then((orderID) => {
                    return orderID;
                });
        }*/

    /*    function onApprove(data, actions) {
            return actions.order.capture().then(async function (details) {
                try {
                    dispatch({type: 'PAY_REQUEST'});
                    const {data} = await axios.put(
                        `/api/orders/${order._id}/pay`,
                        details,
                        {
                            headers: {authorization: `Bearer ${userInfo.token}`},
                        }
                    );
                    dispatch({type: 'PAY_SUCCESS', payload: data});
                    enqueueSnackbar('Order is paid', {variant: 'success'});
                } catch (err) {
                    dispatch({type: 'PAY_FAIL', payload: getError(err)});
                    enqueueSnackbar(getError(err), {variant: 'error'});
                }
            });
        }*/

    /*
        function onError(err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    */

    /** payment handler */
    async function makePaymentHandler() {
        try {
            dispatch({type: 'PAY_REQUEST'});
            const {data} = await axios.put(
                `/api/orders/${order._id}/pay`,
                {},
                {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                }
            );
            dispatch({type: 'PAY_SUCCESS', payload: data});
            enqueueSnackbar('Order is paid', {variant: 'success'});
        } catch (err) {
            dispatch({type: 'PAY_FAIL', payload: getError(err)});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    }

    /** delivery handler */
    async function deliverOrderHandler() {
        try {
            dispatch({type: 'DELIVER_REQUEST'});
            const {data} = await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                }
            );
            dispatch({type: 'DELIVER_SUCCESS', payload: data});
            enqueueSnackbar('Order is delivered', {variant: 'success'});
        } catch (err) {
            dispatch({type: 'DELIVER_FAIL', payload: getError(err)});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    }

    return (
        <Layout title={`Order ${orderId}`}>
            <Typography component="h1" variant="h1">
                Order {orderId}
            </Typography>
            {loading ? (
                <CircularProgress/>
            ) : error ? (
                <Typography sx={classes.error}>{error}</Typography>
            ) : (
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>
                        {orderItems[0]?.type !== COURSE_TYPE && (
                            <Card sx={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h2" variant="h2">
                                            Shipping Address
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        {shippingAddress?.fullName}, {shippingAddress?.address},{' '}
                                        {shippingAddress?.city}, {shippingAddress?.postalCode},{' '}
                                        {shippingAddress?.country}
                                        &nbsp;
                                        {shippingAddress?.location && (
                                            <Link
                                                variant="button"
                                                target="_new"
                                                href={`https://maps.google.com?q=${shippingAddress?.location?.lat},${shippingAddress?.location?.lng}`}
                                            >
                                                Show On Map
                                            </Link>
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        Delivery Status:{' '}
                                        {isDelivered
                                            ? `Delivered at ${deliveredAt}`
                                            : 'Not Delivered'}
                                    </ListItem>
                                </List>
                            </Card>
                        )}
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant="h2">
                                        Payment
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>
                                                Payment Method:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Chip
                                                label={paymentMethod}
                                                size='medium'
                                                color='primary'
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>
                                                Payment Status:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            {
                                                isPaid ?
                                                    <Chip
                                                        label={`Paid at ${moment(paidAt).format('MMMM Do YYYY, h:mm:ss a')}`}
                                                        size='medium'
                                                        color='secondary'
                                                    />
                                                    :
                                                    <Chip
                                                        label='Not Paid'
                                                        size='medium'
                                                        color='primary'
                                                    />
                                            }
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </Card>
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component="h2" variant="h2">
                                        Order Items
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell align="right">Quantity</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderItems.map((item) => (
                                                    <TableRow key={item._id}>
                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        width={50}
                                                                        height={50}
                                                                    />
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>

                                                        <TableCell>
                                                            <NextLink href={`/product/${item.slug}`} passHref>
                                                                <Link>
                                                                    <Typography>{item.name}</Typography>
                                                                </Link>
                                                            </NextLink>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>{item.quantity}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography>{item.price} ৳</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Order Summary</Typography>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Items:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">{itemsPrice} ৳</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>Shipping:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">{shippingPrice} ৳</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography>
                                                <strong>Total:</strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right">
                                                <strong>{totalPrice} ৳</strong>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {/*{!isPaid && (
                                    <ListItem>
                                        {isPending ? (
                                            <CircularProgress/>
                                        ) : (
                                            <Box sx={classes.fullWidth}>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </Box>
                                        )}
                                    </ListItem>
                                )}*/}
                                {userInfo?.isAdmin && !isPaid && (
                                    <ListItem>
                                        {loadingDeliver && <CircularProgress/>}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={makePaymentHandler}
                                        >
                                            Make Payment
                                        </Button>
                                    </ListItem>
                                )}
                                {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && orderItems[0].type !== COURSE_TYPE && (
                                    <ListItem>
                                        {loadingDeliver && <CircularProgress/>}
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={deliverOrderHandler}
                                        >
                                            Deliver Order
                                        </Button>
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
}

export async function getServerSideProps({params}) {
    return {props: {params}};
}

export default dynamic(() => Promise.resolve(Order), {ssr: false});
