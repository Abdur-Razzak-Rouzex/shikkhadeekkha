import {Button, Grid, TextField, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useMemo} from 'react';
import Cookies from 'js-cookie';
import {useForm} from 'react-hook-form';
import Form from "../../components/Form";
import AdmissionWizard from "../../components/AdmissionWizard";
import Layout from "../../components/Layout";
import {Store} from "../../utils/Store";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {MOBILE_NUMBER_REGEX} from "../../components/common/constants";

const initialValues = {
    guardianName: '',
    relation: '',
    guardianMobileNumber: '',
    guardianWhatsappNumber: '',
    guardianEmail: '',
};

export default function AcademicGuardianInfo() {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {
        userInfo,
        admission: {academicGuardianInfo},
    } = state;

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login?redirect=/admission-form/student-info');
        }
        if (academicGuardianInfo) {
            reset({
                guardianName: academicGuardianInfo?.guardianName,
                relation: academicGuardianInfo?.relation,
                guardianMobileNumber: academicGuardianInfo?.guardianMobileNumber,
                guardianWhatsappNumber: academicGuardianInfo?.guardianWhatsappNumber,
                guardianEmail: academicGuardianInfo?.guardianEmail,
            })
        } else {
            reset(initialValues);
        }
    }, []);

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            guardianName: yup
                .string()
                .required('অভিভাবকের নাম অবশ্যই পূরণ করতে হবে')
                .label("অভিভাবকের নাম"),
            relation: yup
                .string()
                .required('সম্পর্ক অবশ্যই পূরণ করতে হবে')
                .label("সম্পর্ক"),
            guardianMobileNumber: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, 'আপনার সঠিক নাম্বারটি দিন')
                .required('মোবাইল নাম্বার অবশ্যই পূরণ করতে হবে')
                .label("মোবাইল নাম্বার"),
            guardianWhatsappNumber: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, 'আপনার সঠিক নাম্বারটি দিন')
                .required('হোয়াটসঅ্যাপ নাম্বার অবশ্যই পূরণ করতে হবে')
                .label("হোয়াটসঅ্যাপ নাম্বার"),
            guardianEmail: yup
                .string()
                .email('আপনার ইমেইলটি সঠিক নয়')
                .required('ইমেইল অবশ্যই পূরণ করতে হবে')
                .label("ইমেইল"),
        })
    }, []);

    const {
        register,
        reset,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const submitHandler = ({
                               guardianName,
                               relation,
                               guardianMobileNumber,
                               guardianWhatsappNumber,
                               guardianEmail
                           }) => {
        dispatch({
            type: 'SAVE_ACADEMIC_GUARDIAN_INFO',
            payload: {
                guardianName,
                relation,
                guardianMobileNumber,
                guardianWhatsappNumber,
                guardianEmail
            },
        });
        Cookies.set(
            'academicGuardianInfo',
            JSON.stringify({
                guardianName,
                relation,
                guardianMobileNumber,
                guardianWhatsappNumber,
                guardianEmail
            })
        );
        router.push('/admission-form/other-info');
    };

    return (
        <Layout title="একাডেমিক অভিভাবক">
            <AdmissionWizard activeStep={3}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    একাডেমিক অভিভাবক
                </Typography>

                <Grid container spacing={5}>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.guardianName}
                            variant="outlined"
                            fullWidth
                            id="guardianName"
                            label="অভিভাবকের নাম"
                            {...register("guardianName")}
                            helperText={errors?.guardianName?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.relation}
                            variant="outlined"
                            fullWidth
                            id="relation"
                            label="অভিভাবকের সাথে সম্পর্ক"
                            {...register("relation")}
                            helperText={errors?.relation?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.guardianMobileNumber}
                            variant="outlined"
                            fullWidth
                            id="guardianMobileNumber"
                            label=" অভিভাবকেরমোবাইল নাম্বার"
                            {...register("guardianMobileNumber")}
                            helperText={errors?.guardianMobileNumber?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.guardianWhatsappNumber}
                            variant="outlined"
                            fullWidth
                            id="guardianWhatsappNumber"
                            label="অভিভাবকের হোয়াটসঅ্যাপ নাম্বার"
                            {...register("guardianWhatsappNumber")}
                            helperText={errors?.guardianWhatsappNumber?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.guardianEmail}
                            variant="outlined"
                            fullWidth
                            id="guardianEmail"
                            label="অভিভাবকের ইমেইল"
                            {...register("guardianEmail")}
                            helperText={errors?.guardianEmail?.message ?? null}
                        />
                    </Grid>
                    <Grid item md={6} />

                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            color="secondary"
                            onClick={() => router.push('/admission-form/parents-info')}
                        >
                            Back
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            color="primary"
                        >
                            Continue
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </Layout>
    );
}
