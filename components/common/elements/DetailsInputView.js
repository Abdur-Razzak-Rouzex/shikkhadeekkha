import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import React from 'react';
import {Skeleton} from "@mui/material";

const PREFIX = 'DetailsInputView';

const classes = {
    inputView: `${PREFIX}-inputView`,
    label: `${PREFIX}-label`,
};

const StyledGrid = styled(Grid)(() => {
    return {
        [`& .${classes.inputView}`]: {
            fontWeight: 500,
            fontSize: 14,
            width: '100%',
            minHeight: '40px',
            padding: '8px',
            lineHeight: 1.5,
            boxShadow: '0px 0px 3px #ddd',
            borderRadius: '0.25rem',
            marginTop: '8px',
            maxHeight: '150px',
            overflow: 'auto',
        },

        [`& .${classes.label}`]: {
            fontWeight:700,
            fontSize: 14,
            marginBottom: '5px',
        },
    };
});

const DetailsInputView = ({label, value, isLoading = false}) => {
    return isLoading ? (
        <Skeleton variant='text' height={50} />
    ) : (
        <StyledGrid item xs={12}>
            <FormLabel className={classes.label}>{label}</FormLabel>
            <div className={classes.inputView}>{value}</div>
        </StyledGrid>
    );
};

export default React.memo(DetailsInputView);
