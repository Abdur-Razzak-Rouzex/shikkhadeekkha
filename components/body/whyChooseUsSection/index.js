import TitleAndSubtitle from "../../common/TitleAndSubtitle";
import {
    Box, Button, Card, CardActions, CardContent, CardMedia,
    Container, Grid, Typography
} from "@mui/material";

const Feature = ({item: {img, title, text}}) => {
    return (
        <Grid item xs={12} sm={6} md={4} elevation={1}>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="140"
                    image={img.src}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default function WhyChooseUsSection({items, title, subtitle}) {
    return (
        <Box component="section" sx={{paddingBottom: 5}}>
            <Container>
                {title && <TitleAndSubtitle title={title} subtitle={subtitle}/>}
                <Grid container spacing={3}>
                    {items?.map((item, key) => (
                        <Feature item={item} key={key}/>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
