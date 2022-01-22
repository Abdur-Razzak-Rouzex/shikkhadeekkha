import React from 'react';
import {Button, Skeleton} from '@mui/material';
import {Save} from '@mui/icons-material';

const SubmitButton = ({onClick, className, label, isSubmitting, isLoading, startIcon, ...rest}) => {
    const btnText = label ? label : "Done";
    return isLoading ? (
        <Skeleton variant='text' height={60} width={100} />
    ) : (
        <Button
            startIcon={startIcon === false ? undefined : startIcon || <Save/>}
            variant='contained'
            color='primary'
            onClick={onClick}
            className={className}
            type='submit'
            disabled={isSubmitting}
            {...rest}>
            {btnText}
        </Button>
    );
};

export default React.memo(SubmitButton);
