import React from 'react';
import {DialogContent, DialogActions} from '@mui/material';
import CustomMuiModal, {DialogTitle} from './CustomMuiModal';

const HookFormMuiModal = ({handleSubmit, children, actions, ...props}) => {
    return (
        <CustomMuiModal {...props}>
            <DialogTitle onClose={props.onClose}>{props.title}</DialogTitle>
            <form onSubmit={handleSubmit} autoComplete='off'>
                <DialogContent dividers>{children}</DialogContent>
                {actions && <DialogActions>{actions}</DialogActions>}
            </form>
        </CustomMuiModal>
    );
};

export default HookFormMuiModal;
