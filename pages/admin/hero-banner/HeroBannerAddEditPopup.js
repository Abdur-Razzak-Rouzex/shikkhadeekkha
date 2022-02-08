import * as yup from 'yup';
import {Button, CircularProgress, Grid, TextField, Typography} from '@mui/material';
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

const initialValues = {
    imgUrl: '',
    link: '',
    altTitle: ''
};

const HeroBannerAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const [loadingUpload, setLoadingUpload] = useState(false);
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState({});


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
        getValues,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const uploadHandler = async (e) => {
        setLoadingUpload(true);
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('from', 'heroBanner');
        try {
            const {data} = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });

            reset({...getValues(), imgUrl: data.secure_url});
            setLoadingUpload(false);
            enqueueSnackbar('Hero banner image uploaded successfully', {variant: 'success'});

        } catch (error) {
            setLoadingUpload(false);
            enqueueSnackbar(getError(error), {variant: 'error'});
        }
    }

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

    const onSubmit = async ({imgUrl, link, altTitle}) => {
        try {
            if (itemId) {
                await axios.put(
                    `/api/admin/hero-banner/${itemId}`,
                    {imgUrl, link, altTitle},
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Hero Banner updated successfully', {variant: 'success'});
                /*await mutateHeroBanner();*/
            } else {
                await axios.post(
                    `/api/admin/hero-banner`,
                    {imgUrl, link, altTitle},
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
                <Grid item xs={12} md={12}>
                    <TextField
                        error={!!errors.imgUrl}
                        variant="outlined"
                        id="imgUrl"
                        label="Upload Hero Banner Image"
                        {...register("imgUrl")}
                        helperText={errors.imgUrl?.message ?? null}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}/>
                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant="contained" component="label">
                        Upload Hero Banner
                        <input type="file" onChange={uploadHandler} hidden accept="image/*"/>
                    </Button>
                    {loadingUpload && <CircularProgress/>}
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
