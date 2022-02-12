import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import CustomDetailsViewMuiModal from "../../../components/common/modals/CustomDetailsViewMuiModal";
import CancelButton from "../../../components/common/button/CancelButton";
import EditButton from "../../../components/common/button/EditButton";
import axios from "axios";
import {getError} from "../../../utils/error";
import {useSnackbar} from "notistack";
import DetailsInputView from "../../../components/common/elements/DetailsInputView";

const CourseDetailsPopup = ({itemId, openEditModal, ...props}) => {
    const [itemData, setItemData] = useState({});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        const getCourse = async () => {
            try {
                const {data} = await axios.get(`/api/course/${itemId}`);
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        getCourse();

    }, [itemId])

    return (
        <>
            {itemData && (
                <CustomDetailsViewMuiModal
                    open={true}
                    {...props}
                    title={
                        <>
                            <Typography component={'span'} variant={'h5'}>Course details</Typography>
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
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course Name"
                                value={itemData?.name}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course Slug"
                                value={itemData?.slug}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course Category"
                                value={itemData?.category}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course sub-category"
                                value={itemData?.subCategory}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <img src={itemData?.image} alt={itemId?.name} height={300} width={300}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course Fee"
                                value={itemData?.courseFee}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Language Medium"
                                value={itemData?.languageMedium}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Offer in percentage"
                                value={itemData?.offerInPercentage}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Is Featured"
                                value={itemData?.isFeatured}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Is Offered"
                                value={itemData?.isOffered}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Publish Status"
                                value={itemData?.docStatus}
                            />
                        </Grid>

                        TODO:// {/** there will be dangerous html */}
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Course Description"
                                value={itemData?.description}
                            />
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default CourseDetailsPopup;
