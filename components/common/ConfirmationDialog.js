import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const ConfirmationDialog = ({open, onDeny, onConfirm, title, dialogTitle}) => {
    return (
        <Dialog open={open} onClose={onDeny}>
            <Box px={{xs: 5, md: 7}} pt={{xs: 4, md: 6}} pb={{xs: 2, md: 4}}>
                <Box
                    mb={3}
                    component='h4'
                    fontWeight={500}
                    className='font-bold'
                    id='alert-dialog-title'>
                    {dialogTitle}
                </Box>
                <Box>
                    <DialogContentText
                        id='alert-dialog-description'>
                        {title}
                    </DialogContentText>
                </Box>
                <Box pt={2}>
                    <Button
                        onClick={onDeny}
                        color='secondary'
                    >
                        No
                    </Button>
                    <Button
                        onClick={onConfirm}
                        color='primary'
                        autoFocus>
                        Yes
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ConfirmationDialog;
