import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {Button, Card, CircularProgress, Grid, List, ListItem, Typography,} from '@mui/material';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {Store} from "../../utils/Store";
import {getError} from "../../utils/error";
import Layout from "../../components/Layout";
import classes from '../../utils/classes';
import AdmissionWizard from "../../components/AdmissionWizard";

function PlaceOrder() {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {
        userInfo,
        admission: {studentInfo, parentsInfo, academicGuardianInfo, otherInfo},
    } = state;

    const {closeSnackbar, enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo?.name || !userInfo?.token) {
            router.push('/login?redirect=/admission-form/student-info');
        }
    }, []);

    const admissionFormHandler = async () => {
        closeSnackbar();
        try {
            const data = {
                studentInfo,
                parentsInfo,
                academicGuardianInfo,
                otherInfo
            };

            setLoading(true);
            await axios.post(
                '/api/admission',
                data,
                {
                    headers: {
                        authorization: `Bearer ${userInfo?.token}`,
                    },
                }
            );

            dispatch({type: 'ADMISSION_CLEAR'});
            setLoading(false);
            router.push('/thank-you');
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };
    return (
        <Layout title="Place Order">
            <AdmissionWizard activeStep={5}/>
            <Typography component="h1" variant="h1">
                Place Order
            </Typography>

            <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Shipping Address
                                </Typography>
                            </ListItem>
                            <ListItem>

                            </ListItem>
                        </List>
                    </Card>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h2" variant="h2">
                                    Payment Method
                                </Typography>
                            </ListItem>
                            <ListItem>

                            </ListItem>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                <Button
                                    onClick={admissionFormHandler}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Place Order
                                </Button>
                            </ListItem>
                            {loading && (
                                <ListItem>
                                    <CircularProgress/>
                                </ListItem>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});
