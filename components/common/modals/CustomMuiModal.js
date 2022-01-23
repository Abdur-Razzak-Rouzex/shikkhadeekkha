import React from 'react';
import {Dialog, DialogTitle as MuiDialogTitle, IconButton, Typography,} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import Slide from '@mui/material/Slide';


export const DialogTitle = (props) => {
    const {children, onClose, ...other} = props;

    return (
        <MuiDialogTitle {...other} sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography>{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label='close'
                    onClick={onClose}
                    size='large'
                    sx={{marginTop: '-11px'}}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const CustomMuiModal = ({onClose, children, maxWidth = 'md', ...props}) => {
    return (
        <Dialog
            aria-labelledby='simple-modal-title'
            TransitionComponent={Transition}
            aria-describedby='simple-modal-description'
            {...props}
            maxWidth={maxWidth}
            fullWidth
            scroll={'body'}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}>
            {children}
        </Dialog>
    );
};

export default CustomMuiModal;
