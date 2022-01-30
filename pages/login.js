import {
    List,
    ListItem,
    Typography,
    TextField,
    Button,
    Link,
} from '@mui/material';
import axios from 'axios';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import {Store} from '../utils/Store';
import Cookies from 'js-cookie';
import {Controller, useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {getError} from '../utils/error';
import Form from '../components/Form';

export default function Login() {
    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const {redirect} = router.query; // login?redirect=/shipping
    const {state, dispatch} = useContext(Store);
    const {userInfo} = state;
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [router, userInfo]);

    const submitHandler = async ({phone, password}) => {
        closeSnackbar();
        try {
            const {data} = await axios.post('/api/users/login', {
                phone,
                password,
            });
            dispatch({type: 'USER_LOGIN', payload: data});
            Cookies.set('userInfo', JSON.stringify(data));
            await router.push(redirect || '/');
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };
    return (
        <Layout title="Login">
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern: /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/,
                            }}
                            render={({field}) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    inputProps={{type: 'phone'}}
                                    error={Boolean(errors.phone)}
                                    helperText={
                                        errors.phone
                                            ? errors.phone.type === 'pattern'
                                                ? 'Phone number is not valid'
                                                : 'Phone number is required'
                                            : ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 6,
                            }}
                            render={({field}) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    inputProps={{type: 'password'}}
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password
                                            ? errors.password.type === 'minLength'
                                                ? 'Password length is more than 5'
                                                : 'Password is required'
                                            : ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Don&apos;t have an account? &nbsp;
                        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                            <Link>Register</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    );
}
