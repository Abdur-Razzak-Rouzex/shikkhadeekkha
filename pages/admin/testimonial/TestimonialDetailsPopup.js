import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import CustomDetailsViewMuiModal from "../../../components/common/modals/CustomDetailsViewMuiModal";
import CancelButton from "../../../components/common/button/CancelButton";
import EditButton from "../../../components/common/button/EditButton";
import axios from "axios";
import {getError} from "../../../utils/error";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import DetailsInputView from "../../../components/common/elements/DetailsInputView";

const TestimonialDetailsPopup = ({itemId, openEditModal, userInfo, ...props}) => {
    const router = useRouter();
    const [itemData, setItemData] = useState({});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getTestimonial = async () => {
            try {
                const {data} = await axios.get(`/api/testimonial/${itemId}`);
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        getTestimonial();

    }, [itemId])

    return (
        <>
            {itemData && (
                <CustomDetailsViewMuiModal
                    open={true}
                    {...props}
                    title={
                        <>
                            <Typography component={'span'} variant={'h5'}>Testimonial details</Typography>
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
                            <img src={itemData?.avatar} alt={itemId?.title} height={300} width={400}/>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Name"
                                value={itemData?.name}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Designation"
                                value={itemData?.designation}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Message"
                                value={itemData?.message}
                            />
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default TestimonialDetailsPopup;
