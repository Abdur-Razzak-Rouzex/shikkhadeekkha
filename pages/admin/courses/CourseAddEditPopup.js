import * as yup from 'yup';
import {Grid, TextField, Typography} from '@mui/material';
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
import FilePondUploader from "../../../components/common/FilePondUploader";

const initialValues = {
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    image: '',
    courseFee: 0,
    languageMedium: 'Bangla',
    offerInPercentage: 0,
    isFeatured: false,
    isOffered: false,
    docStatus: 'active',
    description: '',
};

const CourseAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState({});
    const [categories, setCategories] = useState({});

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getCourse = async () => {
            try {
                const {data} = await axios.get(`/api/course/${itemId}`);
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        const getCategories = async () => {
            try {
                const {data} = await axios.get('/api/category');
                setCategories(data);
            } catch (e) {
                enqueueSnackbar(getError(e), {variant: 'error'});
            }
        }

        if (itemId) {
            getCourse();
            getCategories();
        }
    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            name: yup
                .string()
                .required()
                .label("Course Name"),
            slug: yup
                .string()
                .required()
                .label("Course Slug"),
            category: yup
                .string()
                .required()
                .label("Category"),
            subCategory: yup
                .string()
                .label("Sub-category"),
            image: yup
                .string()
                .required()
                .label("Course Image"),
            courseFee: yup
                .number()
                .required()
                .label("Course Fee"),
            languageMedium: yup
                .string()
                .required()
                .label("Language Medium"),
            description: yup
                .string()
                .required()
                .label("Course Description"),
            isFeatured: yup
                .boolean()
                .required()
                .label("Is Featured"),
            isOffered: yup
                .boolean()
                .required()
                .label("Is Offered"),
            offerInPercentage: yup
                .mixed()
                .label("Offer Price In percentage")
                .when('isOffered', {
                    is: true,
                    then: yup.number().required(),
                }),
            docStatus: yup
                .string()
                .required()
                .label("Status"),
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
                name: itemData?.name,
                slug: itemData?.slug,
                category: itemData?.category,
                subCategory: itemData?.subCategory,
                image: itemData?.image,
                courseFee: itemData?.courseFee,
                languageMedium: itemData?.languageMedium,
                offerInPercentage: itemData?.offerInPercentage,
                description: itemData?.description,
                isFeatured: itemData?.isFeatured,
                isOffered: itemData?.isOffered,
                docStatus: itemData?.docStatus,
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const getSecureUrl = (secureUrl) => {
        setValue('image', secureUrl);
    }

    const onSubmit = async (data) => {
        try {
            if (itemId) {
                await axios.put(
                    `/api/course/${itemId}`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Course updated successfully', {variant: 'success'});
            } else {
                await axios.post(
                    `/api/course`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Course created successfully', {variant: 'success'});
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
                        (<Typography component={'span'} variant={'h5'}>Edit Course</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new Course</Typography>)
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
                <Grid item xs={12}>
                    <FilePondUploader
                        required={true}
                        id="image"
                        getUrl={getSecureUrl}
                    />
                </Grid>
            </Grid>
        </HookFormMuiModal>
    );
};
export default CourseAddEditPopup;
