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
                const {data} = await axios.get(`/api/why-choose-us/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
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
                            <Typography component={'span'} variant={'h5'}>Hero Banner details</Typography>
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
                            <img src={itemData?.image} alt={itemId?.altTitle} height={300} width={850}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Link"
                                value={itemData?.link}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <DetailsInputView
                                label="Alt title"
                                value={itemData?.altTitle}
                            />
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default WhyChooseUsDetailsPopup;
