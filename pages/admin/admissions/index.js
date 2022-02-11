import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext, useEffect, useReducer} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Grid,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import {Store} from "../../../utils/Store";
import AdminMenuItems from "../../../components/admin/AdminMenuItems";
import classes from '../../../utils/classes';
import Layout from "../../../components/Layout";
import {getError} from "../../../utils/error";


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, summary: action.payload, error: ''};
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
        default:
            return state;
    }
}

function AdmissionDashboard() {
    const {state} = useContext(Store);
    const router = useRouter();

    const {userInfo} = state;

    const [{loading, error, summary}, dispatch] = useReducer(reducer, {
        loading: true,
        summary: {salesData: []},
        error: '',
    });

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/admission/admission-summary`, {
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
        <Layout title="Admission Requests">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <AdminMenuItems activeItem="admission"/>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem>
                                {loading ? (
                                    <CircularProgress/>
                                ) : error ? (
                                    <Typography sx={classes.error}>{error}</Typography>
                                ) : (
                                    <Grid container spacing={5}>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.ccap}
                                                    </Typography>
                                                    <Typography>CCAP</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/CCAP [Cadet College Admission Program]" passHref>
                                                        <Button size="small" color="primary">
                                                            View CCAP
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.seven}
                                                    </Typography>
                                                    <Typography>Seven</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/Class Seven [Academic Program]" passHref>
                                                        <Button size="small" color="primary">
                                                            View Seven
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.eight}
                                                    </Typography>
                                                    <Typography>Eight</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/Class Eight [Academic Program]" passHref>
                                                        <Button size="small" color="primary">
                                                            View Eight
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.nine}
                                                    </Typography>
                                                    <Typography>Nine</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/Class Nine [Academic Program]" passHref>
                                                        <Button size="small" color="primary">
                                                            View Nine
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.ten}
                                                    </Typography>
                                                    <Typography>Ten</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/Class Ten [Academic Program]" passHref>
                                                        <Button size="small" color="primary">
                                                            View Ten
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.ani}
                                                    </Typography>
                                                    <Typography>ANI</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/ANI [SSC Examinee]" passHref>
                                                        <Button size="small" color="primary">
                                                            View ANI
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.hsc1}
                                                    </Typography>
                                                    <Typography>HSC 01</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/HSC 01" passHref>
                                                        <Button size="small" color="primary">
                                                            View HSC 01
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant="h1">
                                                        {summary?.hsc2}
                                                    </Typography>
                                                    <Typography>HSC 02</Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/admissions/HSC 02" passHref>
                                                        <Button size="small" color="primary">
                                                            HSC 02
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )}
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdmissionDashboard), {ssr: false});
