import React from 'react';
import {Button, Skeleton} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const CancelButton = ({onClick, className, label, isLoading = false}) => {
    const btnText = label ? label : "Cancel";
    return isLoading ? (
        <Skeleton variant='text' height={60} width={100} />
    ) : (
        <Button
            startIcon={<CancelIcon/>}
            variant='outlined'
            onClick={onClick}
            className={className}>
            {btnText}
        </Button>
    );
};
export default React.memo(CancelButton);
