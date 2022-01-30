import Layout from "../components/Layout";
import {Box, Container, Grid, Typography} from "@mui/material";


const FAQs = () => {

    return (
        <Layout>
            <Box component="section" sx={{paddingBottom: 5}}>
                <Container>
                    <Box mb={10} mt={10}>
                        <Typography variant="h1" align="center" component="h1">
                            Frequent Asked Questions
                        </Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {/*<FrequentQuestions
                            title="Frequest questions"
                            subtitle="Don't forget, you can contact us on anytime"
                            items={[
                                {
                                    title: 'Lorem ipsum dolor sit amet?',
                                    content: (
                                        <Typography component="p">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                            sagittis felis erat, nec vulputate nibh mattis quis.
                                            Pellentesque habitant morbi tristique senectus et netus et
                                            malesuada fames ac turpis egestas. Cras pharetra non lectus ut
                                            bibendum. Etiam suscipit luctus egestas. Nunc vitae placerat
                                            metus, sed pellentesque risus. Suspendisse potenti. Vestibulum
                                            volutpat felis eget urna tempus gravida. Nunc dui risus, viverra
                                            in erat et, fermentum interdum dolor. Ut non lorem ipsum. Donec
                                            lobortis eu elit et venenatis. Praesent id arcu porta tellus
                                            feugiat hendrerit. Sed pretium ullamcorper felis, id tincidunt
                                            nunc suscipit ac.
                                        </Typography>
                                    ),
                                },
                                {
                                    title: 'Lorem ipsum dolor sit amet?',
                                    subtitle: 'This is a subtitle',
                                    content: (
                                        <>
                                            <Typography component="p" paragraph>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                                sagittis felis erat, nec vulputate nibh mattis quis.
                                                Pellentesque habitant morbi tristique senectus et netus et
                                                malesuada fames ac turpis egestas. Cras pharetra non lectus ut
                                                bibendum. Etiam suscipit luctus egestas. Nunc vitae placerat
                                                metus, sed pellentesque risus. Suspendisse potenti. Vestibulum
                                                volutpat felis eget urna tempus gravida. Nunc dui risus,
                                                viverra in erat et, fermentum interdum dolor. Ut non lorem
                                                ipsum. Donec lobortis eu elit et venenatis. Praesent id arcu
                                                porta tellus feugiat hendrerit. Sed pretium ullamcorper felis,
                                                id tincidunt nunc suscipit ac.
                                            </Typography>
                                            <Typography component="p">
                                                Ut eleifend lacus in ex interdum feugiat. Phasellus lacinia
                                                faucibus ex. Integer sit amet accumsan dui. Integer diam
                                                tortor, auctor vel maximus eu, faucibus quis sem. Curabitur et
                                                purus et nisi tempor interdum eu at velit. Quisque id placerat
                                                mi. Interdum et malesuada fames ac ante ipsum primis in
                                                faucibus. Fusce et suscipit justo, non porttitor enim. Class
                                                aptent taciti sociosqu ad litora torquent per conubia nostra,
                                                per inceptos himenaeos.
                                            </Typography>
                                        </>
                                    ),
                                },
                                {
                                    title: 'Lorem ipsum dolor sit amet?',
                                    content: (
                                        <Typography component="p">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                            sagittis felis erat, nec vulputate nibh mattis quis.
                                            Pellentesque habitant morbi tristique senectus et netus et
                                            malesuada fames ac turpis egestas. Cras pharetra non lectus ut
                                            bibendum. Etiam suscipit luctus egestas. Nunc vitae placerat
                                            metus, sed pellentesque risus. Suspendisse potenti. Vestibulum
                                            volutpat felis eget urna tempus gravida. Nunc dui risus, viverra
                                            in erat et, fermentum interdum dolor. Ut non lorem ipsum. Donec
                                            lobortis eu elit et venenatis. Praesent id arcu porta tellus
                                            feugiat hendrerit. Sed pretium ullamcorper felis, id tincidunt
                                            nunc suscipit ac.
                                        </Typography>
                                    ),
                                },
                                {
                                    title: 'Lorem ipsum dolor sit amet?',
                                    content: (
                                        <Typography component="p">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                            sagittis felis erat, nec vulputate nibh mattis quis.
                                            Pellentesque habitant morbi tristique senectus et netus et
                                            malesuada fames ac turpis egestas. Cras pharetra non lectus ut
                                            bibendum. Etiam suscipit luctus egestas. Nunc vitae placerat
                                            metus, sed pellentesque risus. Suspendisse potenti. Vestibulum
                                            volutpat felis eget urna tempus gravida. Nunc dui risus, viverra
                                            in erat et, fermentum interdum dolor. Ut non lorem ipsum. Donec
                                            lobortis eu elit et venenatis. Praesent id arcu porta tellus
                                            feugiat hendrerit. Sed pretium ullamcorper felis, id tincidunt
                                            nunc suscipit ac.
                                        </Typography>
                                    ),
                                },
                                {
                                    title: 'Lorem ipsum dolor sit amet?',
                                    content: (
                                        <Typography component="p">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                            sagittis felis erat, nec vulputate nibh mattis quis.
                                            Pellentesque habitant morbi tristique senectus et netus et
                                            malesuada fames ac turpis egestas. Cras pharetra non lectus ut
                                            bibendum. Etiam suscipit luctus egestas. Nunc vitae placerat
                                            metus, sed pellentesque risus. Suspendisse potenti. Vestibulum
                                            volutpat felis eget urna tempus gravida. Nunc dui risus, viverra
                                            in erat et, fermentum interdum dolor. Ut non lorem ipsum. Donec
                                            lobortis eu elit et venenatis. Praesent id arcu porta tellus
                                            feugiat hendrerit. Sed pretium ullamcorper felis, id tincidunt
                                            nunc suscipit ac.
                                        </Typography>
                                    ),
                                },
                            ]}
                        />*/}
                        QUESTION and answers will be here
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}

/*export async function getServerSideProps() {
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
}*/

export default FAQs;