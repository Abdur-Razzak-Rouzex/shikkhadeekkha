import React, {useCallback, useState} from 'react';
import Tooltip from '@mui/material/Tooltip';
import {Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../components/common/ConfirmationDialog';

const DeleteButton = ({deleteAction, deleteTitle, className, ...extra}) => {
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const onConfirm = useCallback(() => {
        deleteAction();
        setDeleteDialogOpen(false);
    }, [setDeleteDialogOpen, deleteAction]);

    const onDeny = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    return (
        <>
            <Tooltip title="Delete">
                <Button
                    startIcon={<DeleteIcon/>}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={extra?.color && {color: 'error.main'}}
                    color={'error'}
                    className={className}
                    {...extra}>
                    Delete
                </Button>
            </Tooltip>
            {isDeleteDialogOpen ? (
                <ConfirmationDialog
                    open={isDeleteDialogOpen}
                    onDeny={onDeny}
                    onConfirm={onConfirm}
                    title={deleteTitle}
                    dialogTitle="Delete Item"
                />
            ) : null}
        </>
    );
};

export default React.memo(DeleteButton);
