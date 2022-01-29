import React from 'react';
import {CheckCircleOutline} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import FormLabel from '@mui/material/FormLabel';
import {Chip, Skeleton} from "@mui/material";

const CustomChipRowStatus = ({value, isLoading, label}) => {
    return isLoading ? (
        <Skeleton variant='text' height={50} />
    ) : (
        <>
            {label && (
                <FormLabel
                    sx={{
                        fontWeight: 700,
                        fontSize: '14px',
                        marginBottom: '12px',
                        display: 'block',
                    }}>
                    {label}
                </FormLabel>
            )}
            <Chip
                icon={
                    value ? (
                        <CheckCircleOutline fontSize={'small'} />
                    ) : (
                        <CancelIcon fontSize={'small'} />
                    )
                }
                color={value ? 'primary' : 'secondary'}
                label={value ? ("Active") : ("Inactive")}
            />
        </>
    );
};

export default React.memo(CustomChipRowStatus);
