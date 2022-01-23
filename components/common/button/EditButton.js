import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import {Skeleton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const EditButton = ({onClick, isLoading = false, className, variant = 'contained', ...extra}) => {
    return isLoading ? (
        <Skeleton variant='text' height={60} width={100}/>
    ) : (
        <Tooltip title="Edit">
            <Button
                startIcon={<EditIcon/>}
                onClick={onClick}
                sx={extra?.color && {color: 'secondary.main'}}
                className={className ? className : className}
                color={extra?.color || 'secondary'}
                variant={variant}
                {...extra}>
                Edit
            </Button>
        </Tooltip>
    );
};

export default React.memo(EditButton);
