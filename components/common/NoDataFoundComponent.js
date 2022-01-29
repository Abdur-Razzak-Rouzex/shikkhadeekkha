import {Grid, Typography} from '@mui/material';


const NoDataFoundComponent = () => {

    return (
        <Grid container sx={{justifyContent: 'center', marginTop: 5}}>
            <Typography variant="h1" component="h1">
                No data found
            </Typography>
        </Grid>
    );
};

export default NoDataFoundComponent;
