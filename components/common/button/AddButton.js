import React from 'react';
import {Fab, Skeleton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

const AddButton = ({onClick, className, tooltip, isLoading}) => {
    return isLoading ? (
        <Skeleton variant="circular" width={40} height={40}/>
    ) : (
        <Tooltip title={tooltip}>
            <Fab
                size='small'
                color='primary'
                onClick={onClick}
                className={className}
                aria-label='add'>
                <AddIcon/>
            </Fab>
        </Tooltip>
    );
};

export default React.memo(AddButton);
