import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import React from 'react';
import {Skeleton} from "@mui/material";

const PREFIX = 'DetailsInputView';

export const styleClasses = {
    inputView: `${PREFIX}-inputView`,
    label: `${PREFIX}-label`,
};

export const StyledGrid = styled(Grid)(() => {
    return {
        [`& .${styleClasses.inputView}`]: {
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

        [`& .${styleClasses.label}`]: {
            fontWeight: 700,
            fontSize: 14,
            marginBottom: '5px',
        },
    };
});

const DetailsInputView = ({label, value, isLoading = false, setHeight = false}) => {
    return isLoading ? (
        <Skeleton variant='text' height={50}/>
    ) : (
        <StyledGrid item xs={12}>
            <FormLabel className={styleClasses.label}>{label}</FormLabel>
            {setHeight ? (
                <div className={styleClasses.inputView} style={{minHeight: '400px'}}>{value}</div>
            ) : (
                <div className={styleClasses.inputView}>{value}</div>
            )}
        </StyledGrid>
    );
};

export default React.memo(DetailsInputView);
