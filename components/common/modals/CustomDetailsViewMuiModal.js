import React from 'react';
import {DialogActions, DialogContent} from '@mui/material';
import CustomMuiModal, {DialogTitle} from './CustomMuiModal';

const CustomDetailsViewMuiModalPopup = ({children, actions, ...props}) => {
        return (
            <CustomMuiModal {...props}>
                <DialogTitle onClose={props.onClose}>{props.title}</DialogTitle>
                <DialogContent dividers>{children}</DialogContent>
                {actions && <DialogActions>{actions}</DialogActions>}
            </CustomMuiModal>
        );
    };

export default CustomDetailsViewMuiModalPopup;
