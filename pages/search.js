import {
    Box,
    Button,
    Grid,
    List,
    ListItem,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import {useRouter} from 'next/router';
import React, {useContext} from 'react';
import Layout from '../components/Layout';
import db from '../utils/db';
import classes from '../utils/classes';
import ProductItem from '../components/ProductItem';
import {Store} from '../utils/Store';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import {Pagination} from '@mui/material';
import {useSnackbar} from "notistack";
import Course from "../models/Course";

const PAGE_SIZE = 12;

const prices = [
    {
        name: '1 tk to 100 tk',
        value: '1-100',
    },
    {
        name: '101 tk to 500 tk',
        value: '101-500',
    },
    {
        name: ' 501tk to 1,000 tk',
        value: '501-1000',
    },
    {
        name: ' 1,001tk to 3,000 tk',
        value: '1001-3000',
    },
    {
        name: ' 3,001tk to 5,000 tk',
        value: '3001-5000',
    },
    {
        name: ' 5,001tk to 10,000 tk',
        value: '5001-10000',
    },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();

    const {
        query = 'all',
        subCategory = 'all',
        brand = 'all',
        price = 'all',
        rating = 'all',
        sort = 'featured',
    } = router.query;

    /*const {courses, countProducts, categories, brands, pages} = props;*/
    const {courses, countProducts, subCategories, brands, pages} = props;

    /*const filterSearch = ({page, category, brand, sort, min, max, searchQuery, price, rating,}) => {*/
    const filterSearch = ({page, subCategory, brand, sort, min, max, searchQuery, price, rating,}) => {
        const path = router.pathname;
        const {query} = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        /*if (category) query.category = category;*/
        if (subCategory) query.subCategory = subCategory;
        if (brand) query.brand = brand;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;

        router.push({
            pathname: path,
            query: query,
        });
    };
    /*    const categoryHandler = (e) => {
            filterSearch({category: e.target.value});
        };*/
    const subCategoryHandler = (e) => {
        filterSearch({subCategory: e.target.value});
    };
    const pageHandler = (e, page) => {
        filterSearch({page});
    };
    const brandHandler = (e) => {
        filterSearch({brand: e.target.value});
    };
    const sortHandler = (e) => {
        filterSearch({sort: e.target.value});
    };
    const priceHandler = (e) => {
        filterSearch({price: e.target.value});
    };
    const ratingHandler = (e) => {
        filterSearch({rating: e.target.value});
    };

    const {state, dispatch} = useContext(Store);
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
        <Layout title="search">
            <Grid sx={classes.section} container spacing={1}>
                <Grid item md={3}>
                    <List>
                        {/*<ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Categories</Typography>
                                <Select fullWidth value={category} onChange={categoryHandler}>
                                    <MenuItem value="all">All</MenuItem>
                                    {categories &&
                                        categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        </ListItem>*/}
                        <ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Sub-Categories</Typography>
                                <Select fullWidth value={subCategory} onChange={subCategoryHandler}>
                                    <MenuItem value="all">All</MenuItem>
                                    {subCategories &&
                                        subCategories.map((subCategory) => (
                                            <MenuItem key={subCategory} value={subCategory}>
                                                {subCategory}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Brands</Typography>
                                <Select value={brand} onChange={brandHandler} fullWidth>
                                    <MenuItem value="all">All</MenuItem>
                                    {brands &&
                                        brands.map((brand) => (
                                            <MenuItem key={brand} value={brand}>
                                                {brand}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Prices</Typography>
                                <Select value={price} onChange={priceHandler} fullWidth>
                                    <MenuItem value="all">All</MenuItem>
                                    {prices.map((price) => (
                                        <MenuItem key={price.value} value={price.value}>
                                            {price.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box sx={classes.fullWidth}>
                                <Typography>Ratings</Typography>
                                <Select value={rating} onChange={ratingHandler} fullWidth>
                                    <MenuItem value="all">All</MenuItem>
                                    {ratings.map((rating) => (
                                        <MenuItem dispaly="flex" key={rating} value={rating}>
                                            <Rating value={rating} readOnly/>
                                            <Typography component="span">&amp; Up</Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={9}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {courses.length === 0 ? 'No' : countProducts} Results
                            {query !== 'all' && query !== '' && ' : ' + query}
                            {/*{category !== 'all' && ' : ' + category}*/}
                            {subCategory !== 'all' && ' : ' + subCategory}
                            {brand !== 'all' && ' : ' + brand}
                            {price !== 'all' && ' : Price ' + price}
                            {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                            {(query !== 'all' && query !== '') ||
                            /*category !== 'all' ||*/
                            subCategory !== 'all' ||
                            brand !== 'all' ||
                            rating !== 'all' ||
                            price !== 'all' ? (
                                <Button onClick={() => router.push('/search')}>
                                    <CancelIcon/>
                                </Button>
                            ) : null}
                        </Grid>
                        <Grid item>
                            <Typography component="span" sx={classes.sort}>
                                Sort by
                            </Typography>
                            <Select value={sort} onChange={sortHandler}>
                                <MenuItem value="featured">Featured</MenuItem>
                                <MenuItem value="lowest">Price: Low to High</MenuItem>
                                <MenuItem value="highest">Price: High to Low</MenuItem>
                                <MenuItem value="toprated">Customer Reviews</MenuItem>
                                <MenuItem value="newest">Newest Arrivals</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid sx={classes.section} container spacing={3}>
                        {courses.map((product) => (
                            <Grid item md={4} key={product.name}>
                                <ProductItem
                                    item={product}
                                    addToCartHandler={addToCartHandler}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        sx={classes.section}
                        defaultPage={parseInt(query.page || '1')}
                        count={pages}
                        onChange={pageHandler}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
}

export async function getServerSideProps({query}) {
    await db.connect();
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    /*const category = query.category || '';*/
    const subcategory = query.subCategory || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const sort = query.sort || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
    /*const categoryFilter = category && category !== 'all' ? {category} : {};*/
    const subCategoryFilter = subcategory && subcategory !== 'all' ? {subcategory} : {};
    const brandFilter = brand && brand !== 'all' ? {brand} : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    $gte: Number(rating),
                },
            }
            : {};
    // 10-50
    const priceFilter =
        price && price !== 'all'
            ? {
                price: {
                    $gte: Number(price.split('-')[0]),
                    $lte: Number(price.split('-')[1]),
                },
            }
            : {};

    const order =
        sort === 'featured'
            ? {featured: -1}
            : sort === 'lowest'
                ? {price: 1}
                : sort === 'highest'
                    ? {price: -1}
                    : sort === 'toprated'
                        ? {rating: -1}
                        : sort === 'newest'
                            ? {createdAt: -1}
                            : {_id: -1};

    /*const categories = await Category.find();*/
    const subCategories = await Course.find().distinct('subCategory');
    const brands = await Course.find().distinct('brand');
    const courseDocs = await Course.find(
        {
            ...queryFilter,
            /*...categoryFilter,*/
            ...subCategoryFilter,
            ...priceFilter,
            ...brandFilter,
            ...ratingFilter,
        },
        ['-reviews', '-category'],
    )
        .sort(order)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .lean();

    const countProducts = await Course.countDocuments({
        ...queryFilter,
        /*...categoryFilter,*/
        ...subCategoryFilter,
        ...priceFilter,
        ...brandFilter,
        ...ratingFilter,
    });

    const courses = courseDocs.map(db.convertDocToObj);

    return {
        props: {
            courses,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
            /*categories,*/
            subCategories,
            brands,
        },
    };
}
