import React, {useContext, useEffect, useState} from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
    Grid,
    Link,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    TextField,
    CircularProgress,
    Box, Container,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import Product from '../../models/Product';
import db from '../../utils/db';
import axios from 'axios';
import {Store} from '../../utils/Store';
import {getError} from '../../utils/error';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import Form from '../../components/Form';

export default function ProductScreen(props) {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {userInfo} = state;
    const {product} = props;

    const {enqueueSnackbar} = useSnackbar();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `/api/products/${product?._id}/reviews`,
                {
                    rating,
                    comment,
                },
                {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                }
            );
            setLoading(false);
            setRating(0);
            setComment('');
            enqueueSnackbar('Review submitted successfully', {variant: 'success'});
            fetchReviews();
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    const fetchReviews = async () => {
        try {
            const {data} = await axios.get(`/api/products/${product?._id}/reviews`);
            setReviews(data);
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    useEffect(() => {
        if (product) {
            fetchReviews();
        }
    }, [product]);

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x?._id === product?._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product?._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
        router.push('/cart');
    };

    return (
        <Layout title={product?.name || 'No Product Found'}>
            <Box sx={classes.section}>
                <NextLink href="/search" passHref>
                    {product?.type === 'course' ? (
                        <Link>
                            <Typography>View all courses</Typography>
                        </Link>
                    ) : (
                        <Link>
                            <Typography>View all products</Typography>
                        </Link>
                    )}

                </NextLink>
            </Box>
            {product ? (
                <Box>
                    <Grid container spacing={1}>
                        <Grid item md={6} xs={12}>
                            <Image
                                src={product?.image}
                                alt={product?.name}
                                width={640}
                                height={640}
                                layout="responsive"
                            />
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <List>
                                <ListItem>
                                    <Typography component="h1" variant="h1">
                                        {product?.name}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography>Category: {product?.category}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography>Brand: {product?.brand}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Rating value={product?.rating} readOnly/>
                                    <Link href="#reviews">
                                        <Typography>({product?.numReviews} reviews)</Typography>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Typography> Description: {product?.description}</Typography>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Price</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography>${product?.price}</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Status</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography>
                                                    {product?.countInStock > 0 ? 'In stock' : 'Unavailable'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={addToCartHandler}
                                        >
                                            Add to cart
                                        </Button>
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                    <List>
                        <ListItem>
                            <Typography name="reviews" id="reviews" variant="h2">
                                Customer Reviews
                            </Typography>
                        </ListItem>
                        {reviews.length === 0 && <ListItem>No review</ListItem>}
                        {reviews.map((review) => (
                            <ListItem key={review._id}>
                                <Grid container>
                                    <Grid item sx={classes.reviewItem}>
                                        <Typography>
                                            <strong>{review?.user?.name}</strong>
                                        </Typography>
                                        <Typography>{review?.createdAt.substring(0, 10)}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Rating value={review?.rating} readOnly/>
                                        <Typography>{review?.comment}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                        <ListItem>
                            {userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <List>
                                        <ListItem>
                                            <Typography variant="h2">Leave your review</Typography>
                                        </ListItem>
                                        <ListItem>
                                            <TextField
                                                multiline
                                                variant="outlined"
                                                fullWidth
                                                name="review"
                                                label="Enter comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Rating
                                                name="simple-controlled"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                            >
                                                Submit
                                            </Button>

                                            {loading && <CircularProgress/>}
                                        </ListItem>
                                    </List>
                                </Form>
                            ) : (
                                <Typography variant="h2">
                                    Please{' '}
                                    <Link href={`/login?redirect=/product/${product.slug}`}>
                                        login
                                    </Link>{' '}
                                    to write a review
                                </Typography>
                            )}
                        </ListItem>
                    </List>
                </Box>
            ) : (
                <Container>
                    <Box mt={3}>
                        <Typography variant="h1" align="center" component="h1" color="secondary">
                            Sorry !!! Not found your desired product
                        </Typography>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Image
                            src='/images/not-found.jpg'
                            alt='not-found'
                            title='not-found'
                            width={400}
                            height={400}
                        />
                    </Box>
                </Container>
            )}

        </Layout>
    );
}

export async function getServerSideProps(context) {
    const {params} = context;
    const {slug} = params;

    await db.connect();
    const product = await Product.findOne({slug}, '-reviews').lean();
    if (product === null) {
        return {
            props: {
                product: null,
            },
        };
    }

    return {
        props: {
            product: db.convertDocToObj(product),
        },
    };
}
