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
import {trim} from "lodash/string";

export default function Register() {
    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const router = useRouter();
    const {redirect} = router.query;
    const {state, dispatch} = useContext(Store);
    const {userInfo} = state;
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [router, userInfo]);

    const submitHandler = async ({name, phone, email, password, confirmPassword}) => {
        closeSnackbar();
        if (password !== confirmPassword) {
            enqueueSnackbar("Passwords don't match", {variant: 'error'});
            return;
        }
        phone = trim(phone);
        try {
            const {data} = await axios.post('/api/users/register', {
                name,
                phone,
                email,
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
        <Layout title="Register">
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Register
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 2,
                            }}
                            render={({field}) => (
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    inputProps={{type: 'name'}}
                                    error={Boolean(errors.name)}
                                    helperText={
                                        errors.name
                                            ? errors.name.type === 'minLength'
                                                ? 'Name length is more than 1'
                                                : 'Name is required'
                                            : ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern: /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/
                            }}
                            render={({field}) => (
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    inputProps={{type: 'phone'}}
                                    error={Boolean(errors.phone)}
                                    helperText={
                                        errors.phone
                                            ? errors.phone.type === 'pattern'
                                                ? 'Enter your valid phone number'
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
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            }}
                            render={({field}) => (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    inputProps={{type: 'email'}}
                                    error={Boolean(errors.email)}
                                    helperText={
                                        errors.email
                                            ? errors.email.type === 'pattern'
                                                ? 'Email is not valid'
                                                : 'Email is required'
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
                                    required
                                    variant="outlined"
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    inputProps={{type: 'password'}}
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password
                                            ? errors.password.type === 'minLength'
                                                ? 'Password length must be more than 5'
                                                : 'Password is required'
                                            : ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 6,
                            }}
                            render={({field}) => (
                                <TextField
                                    required
                                    variant="outlined"
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    inputProps={{type: 'password'}}
                                    error={Boolean(errors.confirmPassword)}
                                    helperText={
                                        errors.confirmPassword
                                            ? errors.confirmPassword.type === 'minLength'
                                                ? 'Confirm Password length must be more than 5'
                                                : 'Confirm  Password is required'
                                            : ''
                                    }
                                    {...field}
                                />
                            )}
                        />
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Register
                        </Button>
                    </ListItem>
                    <ListItem>
                        Already have an account? &nbsp;
                        <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                            <Link>Login</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    );
}
