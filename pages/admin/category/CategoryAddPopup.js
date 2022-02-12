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

const initialValues = {
    name: '',
    subCategory: '',
};

const CategoryAddPopup = ({itemId, refreshDataTable, ...props}) => {
    const {enqueueSnackbar} = useSnackbar();
    const isEdit = itemId != null;
    const {state} = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const [itemData, setItemData] = useState({});


    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getCategory = async () => {
            try {
                const {data} = await axios.get(`/api/category/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        if (itemId) {
            getCategory();
        }

    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            name: yup
                .string()
                .required()
                .label("Category Name"),
        })
    }, []);

    const {
        register,
        reset,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (itemData) {
            reset({
                name: itemData?.name
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const onSubmit = async ({name, subCategory}) => {
        try {
            if (itemId) {
                if (!subCategory) {
                    enqueueSnackbar('Add a sub-category first', {variant: 'error'});
                    return;
                }
                await axios.put(
                    `/api/category/${itemId}`,
                    {subCategory},
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Sub-Category created successfully', {variant: 'success'});
            } else {
                await axios.post(
                    `/api/category`,
                    {name},
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('Category created successfully', {variant: 'success'});
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
                        (<Typography component={'span'} variant={'h5'}>Add a new sub-category</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new Category</Typography>)
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
                {isEdit ? (
                    <>
                        <Grid item xs={6}>
                            <TextField
                                error={!!errors.name}
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="Category Name"
                                {...register("name")}
                                helperText={errors.name?.message ?? null}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                id="subCategory"
                                label="sub-category name"
                                {...register("subCategory")}
                            />
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={6}>
                        <TextField
                            error={!!errors.name}
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Category Name"
                            {...register("name")}
                            helperText={errors.name?.message ?? null}
                        />
                    </Grid>
                )}

            </Grid>
        </HookFormMuiModal>
    );
};
export default CategoryAddPopup;
