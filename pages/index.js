import NextLink from 'next/link';
import {Grid, Link, Skeleton, Typography} from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import Course from '../models/Course';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Store} from '../utils/Store';
import ProductItem from '../components/ProductItem';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import classes from '../utils/classes';
import TopLineSection from "../components/homepage/TopLineSection";
import WhyChooseUsSection from "../components/homepage/whyChooseUsSection";
import Image from 'next/image'
import {getError} from "../utils/error";
import {useSnackbar} from "notistack";
import TestimonialsCarousel from "../components/homepage/testimonialsCarouselSection";
import Testimonial from "../models/Testimonial";

export default function Home(props) {
    const {state, dispatch} = useContext(Store);
    const {topRatedProducts, allTestimonials, featuredCourses} = props;
    const {enqueueSnackbar} = useSnackbar();
    const [banners, setBanners] = useState([]);
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [loader, setLoader] = useState(false);

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

    const addToCartHandler = async (product) => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const {data} = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
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

            <TopLineSection topline={topLine}/>

            <Typography variant="h2">Featured Courses</Typography>
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

            <Typography variant="h2">Popular Products</Typography>
            <Grid container spacing={3}>
                {topRatedProducts.map((product) => (
                    <Grid item md={4} key={product.name}>
                        <ProductItem
                            item={product}
                            addToCartHandler={addToCartHandler}
                        />
                    </Grid>
                ))}
            </Grid>

            <WhyChooseUsSection
                title="Why choose us?"
                subtitle="Read the next reasons"
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

    const topRatedProductsDocs = await Product.find({}, '-reviews')
        .lean()
        .sort({
            rating: -1,
        })
        .limit(3);

    const featuredCoursesDocs = await Course.find({isFeatured: true, docStatus: true}, ['-reviews', '-category'])
        .lean()
        .limit(3);

    const testimonialDocs = await Testimonial.find({})
        .lean()

    return {
        props: {
            topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
            featuredCourses: featuredCoursesDocs.map(db.convertDocToObj),
            allTestimonials: testimonialDocs.map(db.convertDocToObj),
        },
    };
}
