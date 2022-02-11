import {Button, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography,} from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import Rating from '@mui/material/Rating';

export default function ProductItem({product, addToCartHandler}) {
    return (
        <Card>
            <NextLink href={`/product/${product.slug}`} passHref>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={product.image}
                        title={product.name}
                    />
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography>{product.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{textAlign: 'end'}}>
                                <Chip
                                    label={`${product?.price} ৳`}
                                    size='medium'
                                    color='secondary'
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Rating
                                    value={product.rating}
                                    readOnly
                                    precision={0.25}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{textAlign: 'end'}}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => addToCartHandler(product)}
                                >
                                    Add to cart
                                </Button>
                            </Grid>
                        </Grid>

                        {/*<Button
                            size="small"
                            color="secondary"
                            variant="contained"
                            onClick={() => router.push('/cart')}
                            title='view cart'
                        >
                            Added
                        </Button>*/}
                    </CardContent>
                </CardActionArea>
            </NextLink>
        </Card>
    );
}
