import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Layout from "../../components/Layout";
import db from "../../utils/db";
import WhyChooseUs from "../../models/WhyChooseUs";
import {Box, Container, Grid, Typography} from "@mui/material";
import {Feature} from "../../components/homepage/whyChooseUsSection";

export default function Home(props) {
    const {whyChooseUsData} = props;

    return (
        <Layout title={'About us'}>
            <Box component="section" sx={{paddingBottom: 5}}>
                <Container>
                    <Box mb={10} mt={10}>
                        <Typography variant="h1" align="center" component="h1">
                            Why Choose Us
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {whyChooseUsData?.map((item, key) => (
                            <Feature item={item} key={key}/>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();

    const whyChooseUsDoc = await WhyChooseUs.find({})
        .lean()
        .sort({
            updatedAt: -1,
        })

    return {
        props: {
            whyChooseUsData: whyChooseUsDoc.map(db.convertDocToObj)
        },
    };
}
