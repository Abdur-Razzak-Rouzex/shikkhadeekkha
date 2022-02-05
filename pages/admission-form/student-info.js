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

const initialValues = {
    studentNameBn: '',
    studentNameEn: '',
    dateOfBirth: '',
    studentClass: '',
    instituteName: '',
    educationMedium: '',
    passportSizePhotoUrl: '',
};

export default function StudentInfo() {

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            studentNameBn: yup
                .string()
                .required('শিক্ষার্থীর নাম  (বাংলা) অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষার্থীর নাম  (বাংলা)"),
            studentNameEn: yup
                .string()
                .required('শিক্ষার্থীর নাম (ইংরেজী) অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষার্থীর নাম (ইংরেজী)"),
            dateOfBirth: yup
                .string()
                .required('জন্মতারিখ অবশ্যই পূরণ করতে হবে')
                .label("জন্মতারিখ"),
            studentClass: yup
                .string()
                .required('শ্রেণী অবশ্যই পূরণ করতে হবে')
                .label("শ্রেণী"),
            instituteName: yup
                .string()
                .required('িক্ষা প্রতিষ্ঠানের নাম অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষা প্রতিষ্ঠানের নাম"),
            educationMedium: yup
                .string()
                .required('শিক্ষার মাধ্যম অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষার মাধ্যম"),
            passportSizePhotoUrl: yup
                .string()
                .required('পাসপোর্ট সাইজের ছবি অবশ্যই দিতে হবে')
                .label("পাসপোর্ট সাইজের ছবি"),
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

    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {
        userInfo,
        admission: {studentInfo},
    } = state;

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login?redirect=/admission-form/student-info');
        }
        if(studentInfo) {
            reset({
                studentNameBn: studentInfo?.studentNameBn,
                studentNameEn: studentInfo?.studentNameEn,
                dateOfBirth: studentInfo?.dateOfBirth,
                studentClass: studentInfo?.studentClass,
                instituteName: studentInfo?.instituteName,
                educationMedium: studentInfo?.educationMedium,
                passportSizePhotoUrl: studentInfo?.passportSizePhotoUrl,
            })
        }else {
            reset(initialValues);
        }
    }, []);

    const submitHandler = ({studentNameBn, studentNameEn, dateOfBirth, studentClass, instituteName, educationMedium, passportSizePhotoUrl}) => {
        dispatch({
            type: 'SAVE_STUDENT_INFO',
            payload: {studentNameBn, studentNameEn, dateOfBirth, studentClass, instituteName, educationMedium, passportSizePhotoUrl},
        });
        Cookies.set(
            'studentInfo',
            JSON.stringify({
                studentNameBn, studentNameEn, dateOfBirth, studentClass, instituteName, educationMedium, passportSizePhotoUrl
            })
        );
        router.push('/admission-form/parents-info');
    };

    return (
        <Layout title="শিক্ষার্থীর তথ্য">
            <AdmissionWizard activeStep={1}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    শিক্ষার্থীর তথ্য
                </Typography>

                <Grid container spacing={5}>

                    <Grid item xs={12} md={6}>
                        <TextField
                            error={!!errors?.studentNameBn}
                            variant="outlined"
                            fullWidth
                            id="studentNameBn"
                            label="শিক্ষার্থীর নাম  (বাংলা)"
                            {...register("studentNameBn")}
                            helperText={errors?.studentNameBn?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            error={!!errors?.studentNameEn}
                            variant="outlined"
                            fullWidth
                            id="studentNameEn"
                            label="শিক্ষার্থীর নাম (ইংরেজী)"
                            {...register("studentNameEn")}
                            helperText={errors?.studentNameEn?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                shrink: true,
                                required: true,
                            }}
                            fullWidth
                            variant="outlined"
                            id="dateOfBirth"
                            label="জন্মতারিখ"
                            type='date'
                            error={!!errors?.dateOfBirth}
                            {...register("dateOfBirth")}
                            helperText={errors?.dateOfBirth?.message ?? null}
                        />
                    </Grid>
                </Grid>

                <Button variant="contained"
                        type="submit"
                        fullWidth color="primary"
                        sx={{marginTop: 5}}
                >
                    Continue
                </Button>
            </Form>
        </Layout>
    );
}
