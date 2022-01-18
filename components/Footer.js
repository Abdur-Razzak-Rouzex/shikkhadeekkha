import classes from "../utils/classes";
import {Box, Typography} from "@mui/material";
import React from "react";

const Footer = () => {
    return (
        <Box component="footer" sx={classes.footer}>
            <Typography>All rights reserved. ShikkhaDeekkha.</Typography>
        </Box>
    )
}

export default Footer