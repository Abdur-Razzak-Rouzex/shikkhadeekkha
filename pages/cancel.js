import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Box, Button, Card, Container, Typography} from "@mui/material";
import Layout from "../components/Layout";
import Image from "next/image";
import React, {useEffect} from "react";
import NextLink from "next/link";
import {useSnackbar} from "notistack";

export default function Welcome() {
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        enqueueSnackbar('Unfortunately your transaction has been cancelled', {variant: 'error'});
    })

    return (
        <Layout title={'সফল'}>
            <Box component="section" sx={{paddingBottom: 5}}>
                <Container>
                    <Card mt={3} raised>
                        <Box mt={3}>
                            <Typography variant="h1" align="center" component="h1">
                                শিক্ষাদীক্ষা পরিবারে আপনাকে স্বাগতম
                            </Typography>
                        </Box>
                        <Box sx={{textAlign: 'center'}}>
                            <Image
                                src='/images/thankyou.gif'
                                alt='শিক্ষাদীক্ষা'
                                title='শিক্ষাদীক্ষা'
                                width={400}
                                height={400}
                            />
                        </Box>
                        <Box sx={{textAlign: 'center'}} mb={3}>
                            <NextLink href="/" passHref>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                >
                                    View your order details
                                </Button>
                            </NextLink>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
}