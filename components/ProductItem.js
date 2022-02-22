import {Button, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Typography,} from '@mui/material';
import React, {useEffect, useState} from 'react';
import NextLink from 'next/link';
import Rating from '@mui/material/Rating';

export default function ProductItem({item, addToCartHandler}) {
    const [offeredPrice, setOfferedPrice] = useState(0);

    useEffect(() => {
        if (item?.isOffered) {
            const newPrice = item?.price - (item?.price * (item?.offerInPercentage / 100));
            setOfferedPrice(Math.ceil(newPrice))
        }
    }, [item]);

    return (
        <Card>
            <NextLink href={`/product/${item?.slug}`} passHref>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={item?.image}
                        title={item?.name}
                    />
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography>{item?.name}</Typography>
                            </Grid>
                            {item?.isOffered ? (
                                <>
                                    <Grid item xs={12} sx={{textAlign: 'end'}}>
                                        <del style={{color: 'red'}}>
                                            <Chip
                                                label={`${item?.price} ৳`}
                                                size='medium'
                                                color='primary'
                                            />
                                        </del>
                                        <Chip
                                            label={`${offeredPrice} ৳`}
                                            size='medium'
                                            color='secondary'
                                            sx={{marginLeft: 2}}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <Grid item xs={12} sx={{textAlign: 'end'}}>
                                    <Chip
                                        label={`${item?.price} ৳`}
                                        size='medium'
                                        color='secondary'
                                    />
                                </Grid>
                            )}
                            <Grid item xs={6}>
                                <Rating
                                    value={item?.rating}
                                    readOnly
                                    precision={0.25}
                                />
                            </Grid>
                            <Grid item xs={6} sx={{textAlign: 'end'}}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => addToCartHandler(item)}
                                >
                                    {item?.type === 'course' ? 'Enroll Now' : 'Add to cart'}
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
