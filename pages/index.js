import NextLink from 'next/link';
import { Grid, Link, Typography } from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import classes from '../utils/classes';
import HeroBanner from "../models/HeroBanner";
import TopLine from "../components/body/TopLine";

export default function Home(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, heroBannersDoc } = props;

  const topline = {
      title: 'the title',
      description: 'the description should be at least two lines'
  }

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout>
      <Carousel
          showThumbs={false}
          autoPlay={true}
          infiniteLoop={true}
          interval={5000}
          transitionTime={1000}
      >
        {heroBannersDoc.map((heroBanner) => (
          <NextLink
            key={heroBanner._id}
            href={`/${heroBanner.link}`}
            passHref
          >
            <Link sx={classes.flex}>
              <img
                  src={heroBanner.imgUrl}
                  alt={heroBanner.altTitle}
                  style={{maxWidth: 1500, maxHeight: 500}}
              />
            </Link>
          </NextLink>
        ))}
      </Carousel>

        <TopLine topline={topline} />

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

  const heroBannersDoc = await HeroBanner.find({}, )
      .lean()
      .limit(3);

  return {
    props: {
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
      heroBannersDoc: heroBannersDoc.map(db.convertDocToObj),
    },
  };
}
