import Layout from "../components/Layout";
import {Accordion, AccordionDetails, AccordionSummary, Box, Container, Divider, Grid, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FAQ from "../models/FAQ";
import db from "../utils/db";
import NoDataFoundComponent from "../components/common/NoDataFoundComponent";

const FAQs = (props) => {
    const {faqs} = props;

    return (
        <Layout>
            <Box component="section" sx={{paddingBottom: 5}}>
                <Container>
                    <Box mb={10} mt={10}>
                        <Typography variant="h1" align="center" component="h1">
                            Frequent Asked Questions
                        </Typography>
                    </Box>
                    {faqs?.length > 0 ? (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {faqs?.map(faq => (
                                    <Accordion key={faq._id} sx={{marginBottom: '10px'}}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>{faq?.questions}</Typography>
                                        </AccordionSummary>
                                        <Divider />
                                        <AccordionDetails>
                                            <Typography>
                                                {faq?.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Grid>
                        </Grid>
                    ):(
                        <NoDataFoundComponent />
                    )}

                </Container>
            </Box>
        </Layout>
    );
}

export async function getServerSideProps() {
    await db.connect();

    const faqDoc = await FAQ.find({})
        .lean()

    return {
        props: {
            faqs: faqDoc.map(db.convertDocToObj)
        },
    };
}

export default FAQs;