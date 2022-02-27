import NextLink from 'next/link';
import {Box, Button, Grid, Link, Skeleton, Typography} from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Course from '../models/Course';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Store} from '../utils/Store';
import ProductItem from '../components/ProductItem';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import classes from '../utils/classes';
import WhyChooseUsSection from "../components/homepage/whyChooseUsSection";
import Image from 'next/image'
import {getError} from "../utils/error";
import {useSnackbar} from "notistack";
import TestimonialsCarousel from "../components/homepage/testimonialsCarouselSection";
import Testimonial from "../models/Testimonial";
import {useRouter} from "next/router";

export default function Home(props) {
    const {state, dispatch} = useContext(Store);
    const {allTestimonials, featuredCourses} = props;
    const {enqueueSnackbar} = useSnackbar();
    const [banners, setBanners] = useState([]);
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getBanners = async () => {
            setLoader(true);
            try {
                const [bannersData, whyChooseUsData] = await Promise.all([
                    axios.get('/api/admin/hero-banner'),
                    axios.get('/api/why-choose-us', {
                        params: {
                            from: 'client'
                        }
                    }),
                ])
                setBanners(bannersData.data);
                setWhyChooseUs(whyChooseUsData.data);
                setLoader(false);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
                setLoader(false);
            }
        };
        getBanners();
    }, [])

    const topLine = {
        title: 'the title',
        description: 'A short and strong description'
    }

    const addToCartHandler = async (item) => {
        if (item?.type === 'course') {
            router.push(`/product/${item?.slug}`)
        } else {
            const existItem = state.cart.cartItems.find((x) => x._id === item?._id);
            const quantity = existItem ? existItem.quantity + 1 : 1;
            const {data} = await axios.get(`/api/products/${item?._id}`);
            if (data.countInStock < quantity) {
                enqueueSnackbar('Sorry. Product is out of stock', {variant: 'error'});
                return;
            }
            dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}});
        }
    };

    return (
        <Layout>
            {loader ?
                (
                    <Skeleton variant='rectangular' height="60vh" width="100%"/>
                ) : (
                    <Carousel
                        showThumbs={false}
                        autoPlay={true}
                        infiniteLoop={true}
                        interval={5000}
                        transitionTime={1000}
                    >
                        {banners.map((heroBanner) => (
                            <NextLink
                                key={heroBanner._id}
                                href={`/${heroBanner.link}`}
                                passHref
                            >
                                <Link sx={classes.flex}>
                                    <Image
                                        src={heroBanner.imgUrl}
                                        alt={heroBanner.altTitle}
                                        width={1500}
                                        height={500}
                                    />
                                </Link>
                            </NextLink>
                        ))}
                    </Carousel>
                )
            }

            <Box sx={{marginY: 10, textAlign: 'center'}}>
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: "cursive",
                        fontWeight: 700,
                        fontSize: "2rem"
                    }}
                >
                    {topLine.title}
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: "#928a8a",
                        fontFamily: "cursive"
                    }}
                >
                    {topLine.description}
                </Typography>
            </Box>

            {/** course section */}
            <Grid container mt={5}>
                <Grid item xs={6}>
                    <Typography variant="h2">Featured Courses</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: 'end', margin: 'auto'}}>
                    <Button size="small" color='secondary' variant='contained' href='/search'>
                        View All
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {featuredCourses.map((course) => (
                    <Grid item md={4} key={course.name}>
                        <ProductItem
                            item={course}
                            addToCartHandler={addToCartHandler}
                        />
                    </Grid>
                ))}
            </Grid>

            {/** products section */}
            {/*<Grid container mt={5}>
                <Grid item xs={6}>
                    <Typography variant="h2">Popular Products</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: 'end', margin: 'auto'}}>
                    <Button size="small" color='secondary' variant='contained' href='/search'>
                        View All
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {topRatedProducts.map((product) => (
                    <Grid item md={4} key={product.name}>
                        <ProductItem
                            item={product}
                            addToCartHandler={addToCartHandler}
                        />
                    </Grid>
                ))}
            </Grid>*/}

            {/** Why choose us section */}
            <Grid container mt={5}>
                <Grid item xs={6}>
                    <Typography variant="h2">Know More About Our Programs, Products & Courses</Typography>
                </Grid>
                <Grid item xs={6} sx={{textAlign: 'end', margin: 'auto'}}>
                    <Button size="small" color='secondary' variant='contained' href='/about-us'>
                        View All
                    </Button>
                </Grid>
            </Grid>
            <WhyChooseUsSection
                items={whyChooseUs}
            />

            <TestimonialsCarousel
                title="Testimonials"
                subtitle="Our clients are happy!"
                items={allTestimonials}
            />
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();

    /*    const topRatedProductsDocs = await Product.find({}, '-reviews')
            .lean()
            .sort({
                rating: -1,
            })
            .limit(3);*/

    const featuredCoursesDocs = await Course.find({isFeatured: true, docStatus: true}, ['-reviews', '-category'])
        .lean()
        .limit(3);

    const testimonialDocs = await Testimonial.find({})
        .lean()

    return {
        props: {
            /*topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),*/
            featuredCourses: featuredCoursesDocs.map(db.convertDocToObj),
            allTestimonials: testimonialDocs.map(db.convertDocToObj),
        },
    };
}
