import classes from "../utils/classes";
import {Box, Grid, Link, Typography} from "@mui/material";
import React from "react";
import NextLink from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <Box component="footer" sx={classes.footer}>
            <Grid container>
                <Grid item md={4} xs={12}>
                    <NextLink href="/about-us" passHref>
                        <Link>
                            <Typography>
                                About Us
                            </Typography>
                        </Link>
                    </NextLink>
                    <NextLink href="/search" passHref>
                        <Link>
                            <Typography>
                                See More Products
                            </Typography>
                        </Link>
                    </NextLink>
                    <NextLink href="/admission-form/student-info" passHref>
                        <Link>
                            <Typography>
                                Take Admission
                            </Typography>
                        </Link>
                    </NextLink>
                </Grid>
                <Grid item md={4} xs={12} sx={{margin: 'auto', textAlign: 'center'}}>
                    <Image
                        src='/images/logo.png'
                        alt='শিক্ষাদীক্ষা'
                        title='শিক্ষাদীক্ষা'
                        width={200}
                        height={200}
                    />
                    <Typography sx={{color: 'white'}}>
                        All rights reserved. &copy; Copyright 2022 ShikkhaDeekkha
                    </Typography>
                </Grid>
                <Grid item md={4} xs={12} sx={{display: 'flex', justifyContent: 'end', margin: 'auto'}}>
                    <NextLink href="/" passHref>
                        <Link>
                            <Typography sx={classes.brand}>শিক্ষাদীক্ষা</Typography>
                            <Typography variant='span' sx={{fontSize: 12, marginLeft: '22px'}}>মননে সৃষ্টির
                                বিকাশ</Typography>
                        </Link>
                    </NextLink>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Footer