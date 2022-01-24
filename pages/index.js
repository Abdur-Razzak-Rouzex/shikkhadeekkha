import NextLink from 'next/link';
import {Grid, Link, Skeleton, Typography} from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import {Store} from '../utils/Store';
import ProductItem from '../components/ProductItem';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import classes from '../utils/classes';
import TopLineSection from "../components/body/TopLineSection";
import WhyChooseUsSection from "../components/body/whyChooseUsSection";
import Image from 'next/image'
import {getError} from "../utils/error";
import {useSnackbar} from "notistack";

export default function Home(props) {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {topRatedProducts} = props;
    const {enqueueSnackbar} = useSnackbar();
    const [banners, setBanners] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const getBanners = async () => {
            setLoader(true);
            try {
                const {data} = await axios.get('/api/admin/hero-banner')
                setBanners(data);
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
        router.push('/cart');
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

            <WhyChooseUsSection
                title="Why choose us?"
                subtitle="Read the next reasons"
                items={[
                    {
                        title: 'The standard ',
                        text:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
                        img: {
                            src: 'https://res.cloudinary.com/arouzex/image/upload/v1642750883/Hero%20Banners/d4nhtv78egb4qgcfhrl3.jpg',
                        },
                    },
                    {
                        title: 'The standard',
                        text:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
                        img: {
                            src: 'https://res.cloudinary.com/arouzex/image/upload/v1642750921/Hero%20Banners/gjaldfwn91xdmismvhvh.jpg',
                        },
                    },
                    {
                        title: 'The standard',
                        text:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
                        img: {
                            src: 'https://res.cloudinary.com/arouzex/image/upload/v1642750987/Hero%20Banners/lxt3qe1ckpchwxcegsfh.jpg',
                        },
                    },
                ]}
            />

            <Typography variant="h2">Popular Products</Typography>
            <Grid container spacing={3}>
                {topRatedProducts.map((product) => (
                    <Grid item md={4} key={product.name}>
                        <ProductItem
                            product={product}
                            addToCartHandler={addToCartHandler}
                        />
                    </Grid>
                ))}
            </Grid>
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
        .limit(6);

    return {
        props: {
            topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
        },
    };
}
