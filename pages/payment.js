import Cookies from 'js-cookie';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import {Store} from '../utils/Store';
import Layout from '../components/Layout';
import Form from '../components/Form';
import CheckoutWizard from '../components/CheckoutWizard';
import {
    Button,
    FormControl,
    FormControlLabel, Grid,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import {useSnackbar} from 'notistack';
import {COURSE_TYPE} from "../components/common/constants";

export default function Payment() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const {state, dispatch} = useContext(Store);
    const {
        userInfo,
        cart: {cartItems, shippingAddress},
    } = state;

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login?redirect=/payment');
        }
        if (cartItems[0]?.type !== COURSE_TYPE) {
            if (!shippingAddress?.address) {
                router.push('/shipping');
            }
        }

        setPaymentMethod(Cookies.get('paymentMethod') || '');

    }, [router, shippingAddress?.address, cartItems]);

    const submitHandler = (e) => {
        closeSnackbar();
        e.preventDefault();
        if (!paymentMethod) {
            enqueueSnackbar('Please select a Payment method first', {variant: 'error'});
        } else {
            dispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod});
            Cookies.set('paymentMethod', paymentMethod);
            router.push('/placeorder');
        }
    };
    return (
        <Layout title="Payment Method">
            <CheckoutWizard activeStep={2}/>
            <Form onSubmit={submitHandler}>
                <Typography component="h1" variant="h1" sx={{marginBottom: 0}}>
                    Payment Method
                </Typography>
                <Typography
                    component="span"
                    variant="span"
                    sx={{
                        marginLeft: "35px",
                        fontSize: "15px",
                        color: "#a22929",
                    }}
                >
                    * Very soon we will add online payment system
                </Typography>
                <List>
                    <ListItem>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Payment Method"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                {/*<FormControlLabel
                                    label="PayPal"
                                    value="PayPal"
                                    control={<Radio/>}
                                />
                                <FormControlLabel
                                    label="Stripe"
                                    value="Stripe"
                                    control={<Radio/>}
                                />*/}
                                <FormControlLabel
                                    label="Cash"
                                    value="Cash"
                                    control={<Radio/>}
                                />
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <Grid container>
                        <Grid item md={6} xs={12}>
                            <ListItem>
                                <Button
                                    fullWidth
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => router.push('/shipping')}
                                >
                                    Back
                                </Button>
                            </ListItem>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <ListItem>
                                <Button fullWidth type="submit" variant="contained" color="primary">
                                    Continue
                                </Button>
                            </ListItem>
                        </Grid>
                    </Grid>

                </List>
            </Form>
        </Layout>
    );
}
