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
    questions: '',
    answer: '',
};

const FAQAddEditPopup = ({itemId, refreshDataTable, ...props}) => {
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

        const getFAQ = async () => {
            try {
                const {data} = await axios.get(`/api/faq/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        if (itemId) {
            getFAQ();
        }

    }, [itemId])

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            questions: yup
                .string()
                .required()
                .label("Question"),
            answer: yup
                .string()
                .required()
                .label("Answer"),
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
                questions: itemData?.questions,
                answer: itemData?.answer,
            });
        } else {
            reset(initialValues);
        }
    }, [itemData, reset]);

    const onSubmit = async (data) => {
        try {
            if (itemId) {
                await axios.put(
                    `/api/faq/${itemId}`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('FAQ updated successfully', {variant: 'success'});
            } else {
                await axios.post(
                    `/api/faq`,
                    data,
                    {headers: {authorization: `Bearer ${userInfo.token}`}}
                );
                enqueueSnackbar('FAQ created successfully', {variant: 'success'});
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
                        (<Typography component={'span'} variant={'h5'}>Edit FAQ</Typography>)
                        : (<Typography component={'span'} variant={'h5'}>Add a new FAQ</Typography>)
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
                        error={!!errors.questions}
                        variant="outlined"
                        fullWidth
                        id="questions"
                        label="Question"
                        {...register("questions")}
                        helperText={errors.questions?.message ?? null}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={!!errors.answer}
                        variant="outlined"
                        fullWidth
                        id="answer"
                        label="Answer"
                        rows={3}
                        multiline={true}
                        {...register("answer")}
                        helperText={errors.answer?.message ?? null}
                    />
                </Grid>
            </Grid>
        </HookFormMuiModal>
    );
};
export default FAQAddEditPopup;
