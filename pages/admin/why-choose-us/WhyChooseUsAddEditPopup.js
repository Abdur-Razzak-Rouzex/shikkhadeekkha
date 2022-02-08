import * as yup from 'yup';
import {Button, Checkbox, CircularProgress, Grid, TextField, Typography} from '@mui/material';
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
    smallImage: '',
    largeImage: '',
    title: '',
    shortDescription: '',
    isFlipBook: false,
    flipBookLink: '',
    contentBody: '',
};

const WhyChooseUsAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const [loadingUpload, setLoadingUpload] = useState(false);
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState({});
    const [isFlipBookChecked, setIsFlipBookChecked] = useState(false);

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getWhyChooseUs = async () => {
            try {
                const {data} = await axios.get(`/api/why-choose-us/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        if (itemId) {
            getWhyChooseUs();
        }

    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            smallImage: yup
                .string()
                .required()
                .label("Small Image"),
            title: yup
                .string()
                .required()
                .label("Title"),
            shortDescription: yup
                .string()
                .required()
                .label("Short Description"),
            isFlipBook: yup
                .boolean()
                .required()
                .label("Is FlipBook"),
            flipBookLink: yup
                .mixed()
                .label("Is FlipBook")
                .when('isFlipBook', {
                    is: true,
                    then: yup.string().required(),
                }),
            contentBody: yup
                .mixed()
                .label("Content Body")
                .when('isFlipBook', {
                    is: false,
                    then: yup.string().required(),
                }),
            largeImage: yup
                .mixed()
                .label("Large Image")
                .when('isFlipBook', {
                    is: false,
                    then: yup.string().required(),
                }),
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

    const uploadHandler = async (e, imageSize = 'image') => {
        setLoadingUpload(true);
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('from', 'whyChooseUs');
        try {
            const {data} = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });

            if (imageSize === 'smallImage') {
                reset({...getValues(), smallImage: data.secure_url});
            } else {
                reset({...getValues(), largeImage: data.secure_url});
            }
            setLoadingUpload(false);
            enqueueSnackbar('Image for "Why choose Us" section uploaded successfully', {variant: 'success'});

        } catch (error) {
            setLoadingUpload(false);
            enqueueSnackbar(getError(error), {variant: 'error'});
        }
    }

    useEffect(() => {
        if (itemData) {
            reset({
                smallImage: itemData?.smallImage,
                largeImage: itemData?.largeImage,
                title: itemData?.title,
                shortDescription: itemData?.shortDescription,
                isFlipBook: itemData?.isFlipBook,
                flipBookLink: itemData?.flipBookLink,
                contentBody: itemData?.contentBody,
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const onSubmit = async (data) => {
        /*console.log('why choose us add edit submitted data: ', data);*/
        try {
            if (itemId) {
                await axios.put(
                    `/api/why-choose-us/${itemId}`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('"Why Choose Us" updated successfully', {variant: 'success'});
            } else {
                await axios.post(
                    `/api/why-choose-us`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('"Why Choose Us" created successfully', {variant: 'success'});
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
                        (<Typography component={'span'} variant={'h5'}>Edit Why Choose Us</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new Why Choose Us</Typography>)
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
                        id="smallImage"
                        label="Upload small image for why choose us section"
                        {...register("smallImage")}
                        helperText={errors.smallImage?.message ?? null}
                        InputProps={{
                            readOnly: true,
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}/>
                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant="contained" component="label">
                        Upload small image
                        <input type="file" onChange={(e) => uploadHandler(e,'smallImage')} hidden accept="image/*"/>
                    </Button>
                    {loadingUpload && <CircularProgress/>}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.title}
                        variant="outlined"
                        fullWidth
                        id="title"
                        label="Title"
                        {...register("title")}
                        helperText={errors.title?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.shortDescription}
                        variant="outlined"
                        fullWidth
                        id="shortDescription"
                        label="Write a short Description"
                        rows={2}
                        multiline={true}
                        {...register("shortDescription")}
                        helperText={errors.shortDescription?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12} sx={{display: 'flex'}}>
                    <Checkbox
                        id="isFlipBook"
                        color={'primary'}
                        checked={isFlipBookChecked}
                        {...register("isFlipBook")}
                        onChange={() => setIsFlipBookChecked(prevState => !prevState)}
                    />
                    <Typography sx={{paddingTop: '10px'}}>Is Flip Book</Typography>
                </Grid>
                {isFlipBookChecked &&
                    (<Grid item xs={12}>
                        <TextField
                            error={!!errors.flipBookLink}
                            variant="outlined"
                            fullWidth
                            id="flipBookLink"
                            label="Insert the flip book link"
                            {...register("flipBookLink")}
                            helperText={errors.flipBookLink?.message ?? null}
                        />
                    </Grid>)}
                {!isFlipBookChecked &&
                    (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    error={!!errors.contentBody}
                                    variant="outlined"
                                    fullWidth
                                    id="contentBody"
                                    label="Write the content body"
                                    rows={10}
                                    multiline={true}
                                    {...register("contentBody")}
                                    helperText={errors.flipBookLink?.message ?? null}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    error={!!errors.largeImage}
                                    variant="outlined"
                                    id="largeImage"
                                    label="Upload large image for about us details page"
                                    {...register("largeImage")}
                                    helperText={errors.largeImage?.message ?? null}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}/>
                            <Grid item xs={6} sx={{display: 'flex', justifyContent: 'end'}}>
                                <Button variant="contained" component="label">
                                    Upload large image
                                    <input type="file" onChange={uploadHandler} hidden
                                           accept="image/*"/>
                                </Button>
                                {loadingUpload && <CircularProgress/>}
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </HookFormMuiModal>
    );
};
export default WhyChooseUsAddEditPopup;
