import * as yup from 'yup';
import {Checkbox, Grid, TextField, Typography} from '@mui/material';
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
import OnlineEditor from "../../../components/common/OnlineEditor";

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
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState(initialValues);
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
                .label("FlipBook link")
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
        setValue,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

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
            setIsFlipBookChecked(itemData?.isFlipBook)
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const getSmallImageSecureUrl = (secureUrl) => {
        setValue('smallImage', secureUrl);
    }

    const getLargeImageSecureUrl = (secureUrl) => {
        setValue('largeImage', secureUrl);
    }

    const onSubmit = async (data) => {
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
                <Grid item xs={12} md={6}>
                    <ImageUploader
                        defaultFileUrl={itemData?.smallImage}
                        required={true}
                        id="smallImage"
                        getUrl={getSmallImageSecureUrl}
                    />
                    <Typography sx={{lineHeight: 0}}>Upload an image of dimension <b>345 * 140</b> </Typography>
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
                                <OnlineEditor
                                    id={'contentBody'}
                                    label={'Write the content body'}
                                    errorInstance={errors}
                                    value={itemData?.contentBody || initialValues.contentBody}
                                    height={'300px'}
                                    key={1}
                                    register={register}
                                    setValue={setValue}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ImageUploader
                                    defaultFileUrl={itemData?.largeImage}
                                    required={true}
                                    id="largeImage"
                                    getUrl={getLargeImageSecureUrl}
                                />
                                <Typography sx={{lineHeight: 0}}>Upload an image of dimension <b>1104 * 350</b>
                                </Typography>
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </HookFormMuiModal>
    );
};
export default WhyChooseUsAddEditPopup;
