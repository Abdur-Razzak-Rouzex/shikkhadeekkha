import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import CustomDetailsViewMuiModal from "../../../components/common/modals/CustomDetailsViewMuiModal";
import CancelButton from "../../../components/common/button/CancelButton";
import EditButton from "../../../components/common/button/EditButton";
import axios from "axios";
import {getError} from "../../../utils/error";
import {useSnackbar} from "notistack";
import DetailsInputView, {styleClasses, StyledGrid} from "../../../components/common/elements/DetailsInputView";
import FormLabel from "@mui/material/FormLabel";

const CategoryDetailsPopup = ({itemId, openEditModal, ...props}) => {
    const [itemData, setItemData] = useState({});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        const getCategory = async () => {
            try {
                const {data} = await axios.get(`/api/category/${itemId}`)
                setItemData(data);
                console.log('categories: ', itemData);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        getCategory();

    }, [itemId])

    return (
        <>
            {itemData && (
                <CustomDetailsViewMuiModal
                    open={true}
                    {...props}
                    title={
                        <>
                            <Typography component={'span'} variant={'h5'}>Category details</Typography>
                        </>
                    }
                    maxWidth={'md'}
                    actions={
                        <>
                            <CancelButton onClick={props.onClose}/>
                            <EditButton
                                variant='contained'
                                onClick={() => openEditModal(itemData?._id)}
                            />
                        </>
                    }>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <DetailsInputView
                                label="Category Name"
                                value={itemData?.name}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <StyledGrid item xs={12}>
                                <FormLabel className={styleClasses?.label}>
                                    Sub-category list
                                </FormLabel>
                                {!itemData?.subCategory?.length > 0 ? (
                                    <Box sx={{textAlign: 'center'}} mt={3}>
                                        <Box className={styleClasses?.inputView}>
                                            &emsp;Nothing added yet
                                        </Box>
                                    </Box>
                                ) : (
                                    itemData?.subCategory?.map(((subCategory, index) => (
                                        <Box className={styleClasses?.inputView}
                                             key={Math.floor(Math.random() * 1000)}>
                                            &emsp;{`${index + 1}  :  ${subCategory}`}
                                        </Box>
                                    )))
                                )}
                            </StyledGrid>
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default CategoryDetailsPopup;
