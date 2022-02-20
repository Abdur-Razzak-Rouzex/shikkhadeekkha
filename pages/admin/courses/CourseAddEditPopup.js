import * as yup from 'yup';
import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography} from '@mui/material';
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
import CkEditor from "../../../components/common/CkEditor";
import CustomCheckBox from "../../../components/common/CustomCheckBox";
import {LANGUAGE_MEDIUM} from "../../../components/common/constants";
import CustomRadioButton from "../../../components/common/CustomRadioButton";

const initialValues = {
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    image: '',
    price: 0,
    languageMedium: LANGUAGE_MEDIUM[0],
    isFeatured: false,
    isOffered: false,
    offerInPercentage: 0,
    docStatus: true,
    description: '',
};

const CourseAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState({});

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');

    const [isFeaturedValue, setIsFeaturedValue] = useState(false);
    const [isOfferedValue, setIsOfferedValue] = useState(false);
    const [docStatusValue, setDocStatusValue] = useState(true);
    const [languageMediumValue, setLanguageMediumValue] = useState(LANGUAGE_MEDIUM[0]);

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
        getCategories();

        if (itemId) {
            getCourse();
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
            price: yup
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
                .boolean()
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
                price: itemData?.price,
                languageMedium: itemData?.languageMedium,
                offerInPercentage: itemData?.offerInPercentage,
                description: itemData?.description,
                isFeatured: itemData?.isFeatured,
                isOffered: itemData?.isOffered,
                docStatus: itemData?.docStatus,
            });
            setCategory(itemData?.category);
            setSubcategory(itemData?.subCategory);
            setIsFeaturedValue(itemData?.isFeatured);
            setIsOfferedValue(itemData?.isOffered);
            setDocStatusValue(itemData?.docStatus);

        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const getSecureUrl = (secureUrl) => {
        setValue('image', secureUrl);
    }
    const handleCategoryChange = (event) => {
        setValue('category', event.target.value);
        setCategory(event.target.value);
        const cat = categories.findIndex(cat => cat.name === event.target.value);
        setSubCategories(categories[cat]?.subCategory);
    }
    const handleSubcategoryChange = (event) => {
        setValue('subCategory', event.target.value);
        setSubcategory(event.target.value);
    }

    const getEditorData = (data) => {
        setValue('description', data);
    }

    const handleIsFeatured = (event) => {
        setIsFeaturedValue(event.target.checked)
        setValue('isFeatured', event.target.checked);
    }
    const handleIsOffered = (event) => {
        setIsOfferedValue(event.target.checked)
        setValue('isOffered', event.target.checked);
    }
    const handleDocStatusChange = (event) => {
        setDocStatusValue(event.target.checked)
        setValue('docStatus', event.target.checked);
    }
    const handleLanguageChange = (event) => {
        setLanguageMediumValue(event.target.value)
        setValue('languageMedium', event.target.value);
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
                console.log('submitted data you expected to be: ', data);
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
                        required
                        error={!!errors.name}
                        variant="outlined"
                        fullWidth
                        id="name"
                        label="Course Name"
                        {...register("name")}
                        helperText={errors.name?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        error={!!errors.slug}
                        variant="outlined"
                        fullWidth
                        placeholder='E.g. cadet-college-admission'
                        id="slug"
                        label="Unique url slug"
                        {...register("slug")}
                        helperText={errors.slug?.message ?? null}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl sx={{minWidth: 271}}>
                        <InputLabel id="category">Select Category</InputLabel>
                        <Select
                            labelId="category"
                            id="category"
                            value={category || ''}
                            label="Select Category"
                            onChange={(event) => handleCategoryChange(event)}
                            error={!!errors?.category}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {categories?.map((cat, key) => (
                                <MenuItem value={cat.name} key={key}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText
                            sx={{color: '#d32f2f'}}>{errors?.category?.message ?? null}</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl sx={{minWidth: 271}}>
                        <InputLabel id="subCategory">Select Sub-Category</InputLabel>
                        <Select
                            labelId="subCategory"
                            id="subCategory"
                            value={subcategory || ''}
                            label="Select Sub-Category"
                            onChange={(event) => handleSubcategoryChange(event)}
                            error={!!errors?.subCategory}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {subCategories?.map((subCat, key) => (
                                <MenuItem value={subCat} key={key}>{subCat}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText
                            sx={{color: '#d32f2f'}}>{errors?.subCategory?.message ?? null}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FilePondUploader
                        required={true}
                        id="image"
                        getUrl={getSecureUrl}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        error={!!errors.price}
                        variant="outlined"
                        fullWidth
                        id="price"
                        label="Course Fee"
                        {...register("price")}
                        helperText={errors.price?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomRadioButton
                        label='Language Medium'
                        value={languageMediumValue}
                        handleChange={handleLanguageChange}
                        options={LANGUAGE_MEDIUM}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomCheckBox
                        checked={isFeaturedValue}
                        handleChange={handleIsFeatured}
                        label='Is Featured'
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CustomCheckBox
                        checked={isOfferedValue}
                        handleChange={handleIsOffered}
                        label='Is Offered'
                    />
                </Grid>

                {isOfferedValue && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={!!errors.offerInPercentage}
                            variant="outlined"
                            fullWidth
                            id="offerInPercentage"
                            label="Offer In Percentage"
                            {...register("offerInPercentage")}
                            helperText={errors.offerInPercentage?.message ?? null}
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6}>
                    <CustomCheckBox
                        checked={docStatusValue}
                        handleChange={handleDocStatusChange}
                        label='Publish'
                    />
                </Grid>
                <Grid item xs={12}>
                    <CkEditor
                        getEditorData={getEditorData}
                        defaultData={itemData?.description}
                    />
                </Grid>
            </Grid>
        </HookFormMuiModal>
    );
};
export default CourseAddEditPopup;
