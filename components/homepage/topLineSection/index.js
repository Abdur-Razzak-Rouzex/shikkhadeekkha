import {Box, Typography} from "@mui/material";

const TopLineSection = ({topline}) => {
    return (
        <Box sx={{marginY: 10, textAlign: 'center'}}>
            <Typography
                variant="h1"
                sx={{
                    fontFamily: "cursive",
                    fontWeight: 700,
                    fontSize: "2rem"
                }}
            >
                {topline.title}
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    color: "#928a8a",
                    fontFamily: "cursive"
                }}
            >
                {topline.description}
            </Typography>
        </Box>
    )
}

export default TopLineSection;
