import React from 'react';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import {Skeleton} from "@mui/material";

const ReadButton = ({onClick, isLoading, children, ...extra}) => {
    return isLoading ? (
        <Skeleton variant='text' height={60} width={100} />
    ) : (
        <Button
            startIcon={<Visibility/>}
            onClick={onClick}
            color='primary'
            {...extra}>
            {children || "Details"}
        </Button>
    );
};

export default React.memo(ReadButton);
