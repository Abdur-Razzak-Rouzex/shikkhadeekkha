import {Avatar, Card, CardContent, Typography,} from '@mui/material';
import Section from "../../common/Section";
import TitleAndSubtitle from "../../common/TitleAndSubtitle";
import {Carousel} from 'react-responsive-carousel';


export default function TestimonialsCarousel({items, title, subtitle}) {
    return (
        <Section>
            {title && <TitleAndSubtitle title={title} subtitle={subtitle}/>}
            <Card sx={{margin: 0}}>
                <Carousel showArrows={false}
                          showThumbs={false}
                          autoPlay={true}
                          infiniteLoop={true}
                          interval={5000}
                          transitionTime={1000}
                          showStatus={false}
                >
                    {items?.map((item, key) => (
                        <Card key={key} sx={{paddingTop: 5}}>
                            <Avatar
                                loading="lazy"
                                sx={{
                                    width: 74,
                                    height: 74,
                                    margin: 'auto'
                                }}
                                src={item?.avatar}
                            />
                            <CardContent>
                                <Typography align="center" variant="h5" component="h4">
                                    {item?.name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: "#928a8a",
                                        fontFamily: "cursive",
                                        lineHeight: 1,
                                        marginLeft: 10
                                    }}
                                >
                                    {item?.designation}
                                </Typography>
                                <blockquote>
                                    <Typography variant="body1" align="center" component="p">
                                        <em>&quot;{item?.message}&quot;</em>
                                    </Typography>
                                </blockquote>
                            </CardContent>
                        </Card>
                    ))}
                </Carousel>
            </Card>
        </Section>
    );
}
