import axios from 'axios';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useReducer} from 'react';
import {Button, Card, CircularProgress, Grid, List, ListItem, TextField, Typography,} from '@mui/material';
import {getError} from '../../../utils/error';
import {Store} from '../../../utils/Store';
import Layout from '../../../components/Layout';
import {Controller, useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import Form from '../../../components/Form';
import classes from '../../../utils/classes';
import AdminMenuItems from "../../../components/admin/AdminMenuItems";

function reducer(state, action) {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return {...state, loadingUpdate: true, errorUpdate: ''};
        case 'CREATE_SUCCESS':
            return {...state, loadingUpdate: false, errorUpdate: ''};
        case 'CREATE_FAIL':
            return {...state, loadingUpdate: false, errorUpdate: action.payload};
        case 'UPLOAD_REQUEST':
            return {...state, loadingUpload: true, errorUpload: ''};
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return {...state, loadingUpload: false, errorUpload: action.payload};

        default:
            return state;
    }
}

const CreateHeroBanner = () => {
    const {state} = useContext(Store);
    const [{error, loadingUpdate, loadingUpload}, dispatch] =
        useReducer(reducer, {
            error: '',
        });
    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
    } = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();

    const {userInfo} = state;

    useEffect(() => {
        if (!userInfo?.name) {
            return router.push('/login');
        }
    }, [router, userInfo?.name]);

    const uploadHandler = async (e, imageField = 'image') => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('from', 'heroBanner');
        try {
            dispatch({type: 'UPLOAD_REQUEST'});
            const {data} = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });
            dispatch({type: 'UPLOAD_SUCCESS'});
            setValue(imageField, data.secure_url);
            enqueueSnackbar('File uploaded successfully', {variant: 'success'});
        } catch (err) {
            dispatch({type: 'UPLOAD_FAIL', payload: getError(err)});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    const submitHandler = async ({imgUrl, link, altTitle}) => {
        closeSnackbar();
        try {
            dispatch({type: 'CREATE_REQUEST'});

            await axios.post(
                `/api/admin/hero-banner`,
                {imgUrl, link, altTitle},
                {headers: {authorization: `Bearer ${userInfo.token}`}}
            );

            dispatch({type: 'CREATE_SUCCESS'});
            enqueueSnackbar('Hero banner created successfully', {variant: 'success'});
            router.push('/admin/hero-banner');

        } catch (err) {
            dispatch({type: 'CREATE_FAIL', payload: getError(err)});
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    return (
        <Layout title="Create Hero Banner">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card sx={classes.section}>
                        <AdminMenuItems activeItem="hero-banners"/>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card sx={classes.section}>
                        <List>
                            <ListItem sx={{justifyContent: 'space-between'}}>
                                <Typography component="h1" variant="h1">
                                    Create Hero Banner
                                </Typography>
                                <Button
                                    onClick={async () => await router.push('/admin/hero-banner')}
                                    color="primary"
                                    variant="contained"
                                >
                                    Back
                                </Button>
                            </ListItem>
                            <ListItem>
                                {error && <Typography sx={classes.error}>{error}</Typography>}
                            </ListItem>
                            <ListItem>
                                <Form onSubmit={handleSubmit(submitHandler)}>
                                    <List>
                                        <ListItem>
                                            <Controller
                                                name="imgUrl"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({field}) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="imgUrl"
                                                        label="Banner Image"
                                                        error={Boolean(errors.image)}
                                                        helperText={errors.image ? 'Image is required' : ''}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" component="label">
                                                Upload File
                                                <input
                                                    type="file"
                                                    onChange={(e) => uploadHandler(e, 'imgUrl')}
                                                    hidden
                                                />
                                            </Button>
                                            {loadingUpload && <CircularProgress/>}
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="link"
                                                control={control}
                                                defaultValue=""
                                                render={({field}) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        id="link"
                                                        label="Link"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="altTitle"
                                                control={control}
                                                defaultValue="Cadet Coaching"
                                                render={({field}) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        id="altTitle"
                                                        label="Image alter title"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </ListItem>

                                        <ListItem>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                fullWidth
                                                color="primary"
                                            >
                                                Create
                                            </Button>
                                            {loadingUpdate && <CircularProgress/>}
                                        </ListItem>
                                    </List>
                                </Form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(CreateHeroBanner), {ssr: false});
