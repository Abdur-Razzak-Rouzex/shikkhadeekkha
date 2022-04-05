import {styled} from '@mui/material/styles';
import {CardMedia, Container, Grid, Typography,} from '@mui/material';
import NoDataFoundComponent from "../common/NoDataFoundComponent";
import React from "react";

const PREFIX = 'RecentActivitiesDetails';

const classes = {
    date: `${PREFIX}-date`,
    icon: `${PREFIX}-icon`,
};

const StyledContainer = styled(Container)(({theme}) => ({
    [`& .${classes.date}`]: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.primary.main,
    },

    [`& .${classes.icon}`]: {
        color: '#ffff',
        padding: '2px',
        borderRadius: '3px',
        '&:not(:last-child)': {marginRight: '10px'},
    },
}));

const RecentActivitiesDetails = ({whyChooseUsData}) => {

    return (
        <StyledContainer maxWidth={'lg'}>
            {whyChooseUsData ? (
                <Grid container>
                    {/*<Grid item xs={12} mt={5}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Box className={classes.date}>
                                    <DateRangeIcon />
                                    <Typography ml={1}>
                                        {whyChooseUsData?.updatedAt}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>*/}

                    <Grid item xs={12}>
                        <Typography
                            component="h1"
                            variant="h1"
                            fontWeight={'bold'}
                            sx={{textAlign: 'center'}}
                        >
                            {whyChooseUsData?.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} my={3}>
                        {whyChooseUsData?.largeImage && (
                            <CardMedia
                                component='img'
                                height='350'
                                image={whyChooseUsData?.largeImage}
                                alt={whyChooseUsData?.title}
                                title={whyChooseUsData?.title}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: whyChooseUsData?.contentBody,
                            }}
                        />
                    </Grid>
                </Grid>
            ) : (
                <NoDataFoundComponent/>
            )}
        </StyledContainer>
    );
};

export default RecentActivitiesDetails;
