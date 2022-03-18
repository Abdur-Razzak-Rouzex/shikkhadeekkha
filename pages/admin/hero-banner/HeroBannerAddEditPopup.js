import * as yup from 'yup';
import { Grid, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useSnackbar} from 'notistack';
import {yupResolver} from "@hookform/resolvers/yup";
import {getError} from "../../../utils/error";
import HookFormMuiModal from '../../../components/common/modals/HookFormMuiModal';
import SubmitButton from "../../../components/common/button/SubmitButton";
import CancelButton from "../../../components/common/button/CancelButton";
import axios from "axios";
import {Store} from "../../../utils/Store";
import {useRouter} from "next/router";
import ImageUploader from "../../../components/common/ImageUploader";

const initialValues = {
    imgUrl: '',
    link: '',
    altTitle: ''
};

const HeroBannerAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState(initialValues);


    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getBanner = async () => {
            try {
                const {data} = await axios.get(`/api/admin/hero-banner/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        if (itemId) {
            getBanner();
        }

    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            imgUrl: yup
                .string()
                .required()
                .label("Image url"),
        })
    }, []);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (itemData) {
            reset({
                imgUrl: itemData?.imgUrl,
                link: itemData?.link,
                altTitle: itemData?.altTitle,
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const getSecureUrl = (secureUrl) => {
        setValue('imgUrl', secureUrl);
    }

    const onSubmit = async (data) => {
        console.log('the submitted data: ', data);
        try {
            if (itemId) {
                await axios.put(
                    `/api/admin/hero-banner/${itemId}`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Hero Banner updated successfully', {variant: 'success'});
                /*await mutateHeroBanner();*/
            } else {
                await axios.post(
                    `/api/admin/hero-banner`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Hero Banner created successfully', {variant: 'success'});
            }
            props.onClose();
            refreshDataTable();
        } catch (error) {
            enqueueSnackbar(getError(error), {variant: 'error'});
        }
    };

    return (
        <HookFormMuiModal
            open={true}
            {...props}
            title={
                <>
                    {isEdit ?
                        (<Typography component={'span'} variant={'h5'}>Edit Hero Banner</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new Hero Banner</Typography>)
                    }
                </>
            }
            maxWidth={'md'}
            handleSubmit={handleSubmit(onSubmit)}
            actions={
                <>
                    <CancelButton onClick={props.onClose}/>
                    <SubmitButton isSubmitting={isSubmitting}/>
                </>
            }>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <ImageUploader
                        defaultFileUrl={itemData?.imgUrl}
                        required={true}
                        id="imgUrl"
                        getUrl={getSecureUrl}
                    />
                    <Typography sx={{lineHeight: 0}}>Upload an image of dimension <b>1152 * 284</b> </Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={!!errors.username}
                        variant="outlined"
                        fullWidth
                        id="link"
                        label="Link"
                        {...register("link")}
                        helperText={errors.link?.message ?? null}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={!!errors.altTitle}
                        variant="outlined"
                        fullWidth
                        id="altTitle"
                        label="Image alter title"
                        {...register("altTitle")}
                        helperText={errors.altTitle?.message ?? null}
                    />
                </Grid>
            </Grid>
        </HookFormMuiModal>
    );
};
export default HeroBannerAddEditPopup;
