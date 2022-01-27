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

const WhyChooseUsDetailsPopup = ({itemId, openEditModal, userInfo, ...props}) => {
    const router = useRouter();
    const [itemData, setItemData] = useState({});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getBanner = async () => {
            try {
                const {data} = await axios.get(`/api/why-choose-us/${itemId}`);
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        getBanner();

    }, [itemId])

    return (
        <>
            {itemData && (
                <CustomDetailsViewMuiModal
                    open={true}
                    {...props}
                    title={
                        <>
                            <Typography component={'span'} variant={'h5'}>Why Choose Us details</Typography>
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
                            <img src={itemData?.image} alt={itemId?.altTitle} height={300} width={400}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Title"
                                value={itemData?.title}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Short Description"
                                value={itemData?.shortDescription}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="isFlipBook"
                                value={itemData?.isFlipBook}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Flip Book Link"
                                value={itemData?.flipBookLink}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <DetailsInputView
                                label="Content Body"
                                value={itemData?.contentBody}
                            />
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default WhyChooseUsDetailsPopup;
