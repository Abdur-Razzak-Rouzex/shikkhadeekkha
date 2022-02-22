import {Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Link, Typography} from "@mui/material";
import NextLink from "next/link";

export const Feature = ({item: {smallImage, title, shortDescription, _id}}) => {
    return (
        <Grid item xs={12} sm={6} md={4} elevation={1}>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="140"
                    image={smallImage}
                    alt={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {shortDescription}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">
                        <NextLink href={`/about-us/${_id}`} passHref>
                            <Link>
                                Learn More
                            </Link>
                        </NextLink>
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default function WhyChooseUsSection({items}) {
    return (
        <Box component="section">
            <Grid container spacing={3}>
                {items?.map((item, key) => (
                    <Feature item={item} key={key}/>
                ))}
            </Grid>
        </Box>
    );
}
