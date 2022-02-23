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
    avatar: '',
    name: '',
    designation: '',
    message: '',
};

const TestimonialAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const [loadingUpload, setLoadingUpload] = useState(false);
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState(initialValues);

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getTestimonials = async () => {
            try {
                const {data} = await axios.get(`/api/testimonial/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        if (itemId) {
            getTestimonials();
        }

    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            avatar: yup
                .string()
                .required()
                .label("Avatar: Small sized image"),
            name: yup
                .string()
                .required()
                .label("Name"),
            designation: yup
                .string()
                .label("Designation"),
            message: yup
                .string()
                .required()
                .label("Message"),
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
        bodyFormData.append('from', 'testimonial');
        try {
            const {data} = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });


            reset({...getValues(), avatar: data.secure_url});
            setLoadingUpload(false);
            enqueueSnackbar('Avatar uploaded successfully', {variant: 'success'});

        } catch (error) {
            setLoadingUpload(false);
            enqueueSnackbar(getError(error), {variant: 'error'});
        }
    }

    useEffect(() => {
        if (itemData) {
            reset({
                avatar: itemData?.avatar,
                name: itemData?.name,
                designation: itemData?.designation,
                message: itemData?.message,
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const onSubmit = async (data) => {
        try {
            if (itemId) {
                await axios.put(
                    `/api/testimonial/${itemId}`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Testimonial updated successfully', {variant: 'success'});
            } else {
                await axios.post(
                    `/api/testimonial`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Testimonial created successfully', {variant: 'success'});
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
                        (<Typography component={'span'} variant={'h5'}>Edit Testimonial</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new Testimonial</Typography>)
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
                        error={!!errors.smallImage}
                        variant="outlined"
                        id="avatar"
                        label="Upload avatar (small image)"
                        {...register("avatar")}
                        helperText={errors.avatar?.message ?? null}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}/>
                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant="contained" component="label">
                        Upload avatar
                        <input type="file" onChange={(e) => uploadHandler(e)} hidden accept="image/*"/>
                    </Button>
                    {loadingUpload && <CircularProgress/>}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.name}
                        variant="outlined"
                        fullWidth
                        id="name"
                        label="Name"
                        {...register("name")}
                        helperText={errors.name?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.designation}
                        variant="outlined"
                        fullWidth
                        id="designation"
                        label="Designation"
                        {...register("designation")}
                        helperText={errors.designation?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.message}
                        variant="outlined"
                        fullWidth
                        id="message"
                        label="Message"
                        rows={3}
                        multiline={true}
                        {...register("message")}
                        helperText={errors?.message?.message ?? null}
                    />
                </Grid>
            </Grid>
        </HookFormMuiModal>
    );
};
export default TestimonialAddEditPopup;
