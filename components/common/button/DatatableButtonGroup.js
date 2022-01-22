import React from 'react';
import {ButtonGroup} from '@mui/material';

const DatatableButtonGroup = ({children}) => {
    return (
        <ButtonGroup
            variant='text'
            color='primary'
            aria-label='text primary button group'>
            {children}
        </ButtonGroup>
    );
};

export default React.memo(DatatableButtonGroup);
