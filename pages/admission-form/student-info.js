import {
    Button, CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import Cookies from 'js-cookie';
import {useForm} from 'react-hook-form';
import Form from "../../components/Form";
import AdmissionWizard from "../../components/AdmissionWizard";
import Layout from "../../components/Layout";
import {Store} from "../../utils/Store";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {EDUCATION_MEDIUM, STUDENT_CLASS} from "../../components/common/constants";
import axios from "axios";
import {getError} from "../../utils/error";
import {useSnackbar} from "notistack";

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
    const [studentClass, setStudentClass] = useState('');
    const [educationMedium, setEducationMedium] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
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
        if (studentInfo) {
            reset({
                studentNameBn: studentInfo?.studentNameBn,
                studentNameEn: studentInfo?.studentNameEn,
                dateOfBirth: studentInfo?.dateOfBirth,
                studentClass: studentInfo?.studentClass,
                instituteName: studentInfo?.instituteName,
                educationMedium: studentInfo?.educationMedium,
                passportSizePhotoUrl: studentInfo?.passportSizePhotoUrl,
            })
            setStudentClass(studentInfo?.studentClass);
            setEducationMedium(studentInfo?.educationMedium);
        } else {
            reset(initialValues);
        }
    }, []);

    const handleClassChange = (id, event) => {
        setValue(id, event.target.value);
        setStudentClass(event.target.value);
    };

    const handleEducationMediumChange = (id, event) => {
        setValue(id, event.target.value);
        setEducationMedium(event.target.value);
    };

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
                .required('শিক্ষা প্রতিষ্ঠানের নাম অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষা প্রতিষ্ঠানের নাম"),
            educationMedium: yup
                .string()
                .required('শিক্ষার মাধ্যম অবশ্যই পূরণ করতে হবে')
                .label("শিক্ষার মাধ্যম"),
            passportSizePhotoUrl: yup
                .string()
                .required('শিক্ষার্থীর পাসপোর্ট সাইজের ছবি অবশ্যই দিতে হবে')
                .label("শিক্ষার্থীর পাসপোর্ট সাইজের ছবি"),
        })
    }, []);

    const {
        register,
        reset,
        handleSubmit,
        getValues,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const uploadHandler = async (e) => {
        setLoadingUpload(true);
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('from', 'studentInfo');
        try {
            const {data} = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });

            reset({...getValues(), passportSizePhotoUrl: data.secure_url});
            setLoadingUpload(false);
            enqueueSnackbar('Photo uploaded successfully', {variant: 'success'});

        } catch (error) {
            setLoadingUpload(false);
            enqueueSnackbar(getError(error), {variant: 'error'});
        }
    }

    const submitHandler = ({studentNameBn, studentNameEn, dateOfBirth, studentClass, instituteName, educationMedium, passportSizePhotoUrl}) => {
        dispatch({
            type: 'SAVE_STUDENT_INFO',
            payload: {
                studentNameBn,
                studentNameEn,
                dateOfBirth,
                studentClass,
                instituteName,
                educationMedium,
                passportSizePhotoUrl
            },
        });
        Cookies.set(
            'studentInfo',
            JSON.stringify({
                studentNameBn,
                studentNameEn,
                dateOfBirth,
                studentClass,
                instituteName,
                educationMedium,
                passportSizePhotoUrl
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
                            InputLabelProps={{
                                required: true,
                            }}
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
                            InputLabelProps={{
                                required: true,
                            }}
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
                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="studentClass">শ্রেণী</InputLabel>
                            <Select
                                labelId="studentClass"
                                id="studentClass"
                                value={studentClass}
                                label="শ্রেণী"
                                onChange={(event) => handleClassChange( "studentClass", event)}
                                error={!!errors?.studentClass}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {STUDENT_CLASS?.map((className, key) => (
                                    <MenuItem value={className.name} key={key}>{className.title}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText
                                sx={{color: '#d32f2f'}}>{errors?.studentClass?.message ?? null}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.instituteName}
                            variant="outlined"
                            fullWidth
                            id="instituteName"
                            label="শিক্ষা প্রতিষ্ঠানের নাম"
                            {...register("instituteName")}
                            helperText={errors?.instituteName?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="educationMedium">শিক্ষার মাধ্যম</InputLabel>
                            <Select
                                labelId="educationMedium"
                                id="educationMedium"
                                value={educationMedium}
                                label="শিক্ষার মাধ্যম"
                                onChange={(event) => handleEducationMediumChange( "educationMedium", event)}
                                error={!!errors?.educationMedium}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {EDUCATION_MEDIUM?.map((education, key) => (
                                    <MenuItem value={education.name} key={key}>{education.title}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText
                                sx={{color: '#d32f2f'}}>{errors?.educationMedium?.message ?? null}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <TextField
                            error={!!errors.passportSizePhotoUrl}
                            variant="outlined"
                            id="passportSizePhotoUrl"
                            label="শিক্ষার্থীর পাসপোর্ট সাইজের ছবি"
                            {...register("passportSizePhotoUrl")}
                            helperText={errors.passportSizePhotoUrl?.message ?? null}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={5}/>
                    <Grid item xs={7} sx={{display: 'flex', justifyContent: 'end'}}>
                        <Button variant="contained" component="label" color='secondary'>
                            আপ্লোড করুন
                            <input type="file" onChange={(e) => uploadHandler(e)} hidden accept="image/*"/>
                        </Button>
                        {loadingUpload && <CircularProgress/>}
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained"
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
