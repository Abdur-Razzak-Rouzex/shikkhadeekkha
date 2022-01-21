import {Box, Typography} from "@mui/material";


export default function TitleAndSubtitle({title, subtitle}) {
    return (
        <Box mb={2}>
            <Typography variant="h5" align="center" component="h2">
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="overline" align="center" component="h2">
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}
