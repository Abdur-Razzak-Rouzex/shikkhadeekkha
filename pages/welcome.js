import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Box, Button, Card, Container, Typography} from "@mui/material";
import Layout from "../components/Layout";
import Image from "next/image";
import React from "react";
import NextLink from "next/link";

export default function welcome() {

    return (
        <Layout title={'স্বাগতম'}>
            <Box component="section" sx={{paddingBottom: 5}}>
                <Container>
                    <Card mt={3}>
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
                                    হোমে ফিরে যান
                                </Button>
                            </NextLink>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
}