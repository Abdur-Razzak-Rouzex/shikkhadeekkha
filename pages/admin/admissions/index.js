import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext, useEffect, useReducer} from 'react';
import {
    Box,
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
import SchoolIcon from '@mui/icons-material/School';


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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '100px'
                                        }}
                                    >
                                        <CircularProgress color="secondary"/>
                                    </Box>
                                ) : error ? (
                                    <Typography sx={classes.error}>{error}</Typography>
                                ) : (
                                    <Grid container spacing={5} sx={{marginBottom: 20}}>
                                        <Grid item xs={12}>
                                            <Typography variant="h1" sx={{textAlign: 'center', marginBottom: 0}}>
                                                Admission Requests
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={5}>
                                                {summary?.length > 0 ? (
                                                    summary.map((course) => (
                                                        <Grid item xs={12} md={3} key={course?.courseName}>
                                                            <Card raised>
                                                                <CardContent sx={{minHeight: 180}}>
                                                                    <Typography variant="h1" sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                                        <SchoolIcon/> {course?.numOfAdmission}
                                                                    </Typography>
                                                                    <Typography color='secondary'>{course?.courseName}</Typography>
                                                                </CardContent>
                                                                <CardActions>
                                                                    <NextLink
                                                                        href={`/admin/admissions/${course?.courseName}`}
                                                                        passHref>
                                                                        <Button size="small" color="primary">
                                                                            View All
                                                                        </Button>
                                                                    </NextLink>
                                                                </CardActions>
                                                            </Card>
                                                        </Grid>
                                                    ))
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Typography variant="h1"
                                                                    sx={{textAlign: 'center', margin: 'auto'}}>
                                                            No course available
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
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
