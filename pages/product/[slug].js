import React, {useContext, useEffect, useState} from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
    Box,
    Button,
    Card, Chip,
    CircularProgress,
    Container,
    Grid,
    Link,
    List,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import db from '../../utils/db';
import axios from 'axios';
import {Store} from '../../utils/Store';
import {getError} from '../../utils/error';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import Form from '../../components/Form';
import Course from "../../models/Course";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {a11yProps, TabPanel} from "../../components/TabPanel";
import Category from "../../models/Category";
import {COURSE_TYPE} from "../../components/common/constants";
import {calculateOfferPrice} from "../../utils/helpers";

export default function ProductScreen(props) {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {userInfo} = state;
    const {course} = props;

    const {enqueueSnackbar} = useSnackbar();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchReviews = async () => {
        try {
            const {data} = await axios.get(`/api/products/${course?._id}/reviews`);
            setReviews(data);
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };

    useEffect(() => {
        if (course) {
            fetchReviews();
        }
    }, [course]);

    const reviewSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `/api/products/${course?._id}/reviews`,
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

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x?._id === course?._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${course?._id}`);
        if (data.countInStock < quantity) {
            enqueueSnackbar('Sorry. Product is out of stock', {variant: 'error'});
            return;
        }
        dispatch({type: 'CART_ADD_ITEM', payload: {...course, quantity}});
        await router.push('/cart');
    };

    const enrollmentHandler = async () => {
        const existedItemType = state.cart.cartItems.find(item => item?.type === COURSE_TYPE);
        if (existedItemType) {
            enqueueSnackbar('Please complete the enrollment of the added course first', {variant: 'error'});
            await router.push('/cart');
        } else {
            const existItem = state.cart.cartItems.find((x) => x?._id === course?._id);
            const quantity = existItem ? existItem.quantity : 1;
            let offeredPrice;
            if (course?.isOffered) {
                offeredPrice = calculateOfferPrice(course?.price, course?.offerInPercentage);
            } else {
                offeredPrice = course?.price;
            }
            dispatch({type: 'CART_ADD_ITEM', payload: {...course, quantity, offeredPrice}});
            await router.push('/payment');
        }
    };

    return (
        <Layout title={course?.name || 'No Product Found'}>
            <Box sx={classes.section}>
                <NextLink href="/search" passHref>
                    {course?.type === COURSE_TYPE ? (
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
            {course ? (
                <Box>
                    <Grid container spacing={1}>
                        <Grid item md={5} xs={12}>
                            <Image
                                src={course?.image}
                                alt={course?.name}
                                width={400}
                                height={280}
                                layout="responsive"
                            />
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <List>
                                <ListItem>
                                    <Typography component="h1" variant="h1">
                                        {course?.name}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography>Category: {course?.category?.name}</Typography>
                                </ListItem>
                                {course?.type !== COURSE_TYPE && (
                                    <ListItem>
                                        <Typography>Brand: {course?.brand}</Typography>
                                    </ListItem>
                                )}
                                <ListItem>
                                    <Rating value={course?.rating} readOnly/>
                                    <Link href="#reviews">
                                        <Typography>({course?.numOfReviews} reviews)</Typography>
                                    </Link>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Price</Typography>
                                            </Grid>
                                            {course?.isOffered ? (
                                                <Grid item xs={6}>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <del style={{color: 'red'}}>
                                                                <Chip
                                                                    label={`${course?.price} ৳`}
                                                                    size='small'
                                                                    color='primary'
                                                                />
                                                            </del>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Chip
                                                                label={`${calculateOfferPrice(course?.price, course?.offerInPercentage)} ৳`}
                                                                size='medium'
                                                                color='secondary'
                                                                sx={{marginLeft: 2}}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <Grid item xs={6}>
                                                    <Chip
                                                        label={`${course?.price} ৳`}
                                                        size='medium'
                                                        color='secondary'
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Status</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                {course?.type === COURSE_TYPE ? (
                                                    <Typography>
                                                        Open for Enrollment
                                                    </Typography>
                                                ) : (
                                                    <Typography>
                                                        {course?.countInStock > 0 ? 'In stock' : 'Unavailable'}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        {course?.type === COURSE_TYPE ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={enrollmentHandler}
                                            >
                                                Enroll Now
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={addToCartHandler}
                                            >
                                                Add to cart
                                            </Button>
                                        )}
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>

                    {/** bottom tab section */}
                    <Box sx={{width: '100%', marginTop: 5}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Rating & Reviews" {...a11yProps(0)} />
                                <Tab label="Description" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
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
                                        <Form onSubmit={reviewSubmitHandler}>
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
                                            <Link href={`/login?redirect=/product/${course.slug}`}>
                                                login
                                            </Link>{' '}
                                            to write a review
                                        </Typography>
                                    )}
                                </ListItem>
                            </List>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: course?.description,
                                }}
                            />
                        </TabPanel>
                    </Box>
                </Box>
            ) : (
                <Container>
                    <Box mt={3}>
                        <Typography variant="h1" align="center" component="h1" color="secondary">
                            Sorry !!! Your desired product is not found
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
    const course = await Course.findOne({slug: slug}).lean().populate('category', 'name', Category);
    if (course === null) {
        return {
            props: {
                course: null,
            },
        };
    }

    return {
        props: {
            course: db.convertDocToObj(course),
        },
    };
}
