import {
    Button,
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
import FilePondUploader from "../../components/common/FilePondUploader";

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
                .required('????????????????????????????????? ?????????  (???????????????) ?????????????????? ???????????? ???????????? ?????????')
                .label("????????????????????????????????? ?????????  (???????????????)"),
            studentNameEn: yup
                .string()
                .required('????????????????????????????????? ????????? (??????????????????) ?????????????????? ???????????? ???????????? ?????????')
                .label("????????????????????????????????? ????????? (??????????????????)"),
            dateOfBirth: yup
                .string()
                .required('??????????????????????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("???????????????????????????"),
            studentClass: yup
                .string()
                .required('?????????????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????????"),
            instituteName: yup
                .string()
                .required('?????????????????? ???????????????????????????????????? ????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("?????????????????? ???????????????????????????????????? ?????????"),
            educationMedium: yup
                .string()
                .required('????????????????????? ?????????????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("????????????????????? ??????????????????"),
            passportSizePhotoUrl: yup
                .string()
                .required('????????????????????????????????? ???????????????????????? ?????????????????? ????????? ?????????????????? ???????????? ?????????')
                .label("????????????????????????????????? ???????????????????????? ?????????????????? ?????????"),
        })
    }, []);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const getSecureUrl = (secureUrl) => {
        setValue('passportSizePhotoUrl', secureUrl);
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
        <Layout title="????????????????????????????????? ????????????">
            <AdmissionWizard activeStep={1}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    ????????????????????????????????? ????????????
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
                            label="????????????????????????????????? ?????????  (???????????????)"
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
                            label="????????????????????????????????? ????????? (??????????????????)"
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
                            label="???????????????????????????"
                            type='date'
                            error={!!errors?.dateOfBirth}
                            {...register("dateOfBirth")}
                            helperText={errors?.dateOfBirth?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="studentClass">??????????????????</InputLabel>
                            <Select
                                labelId="studentClass"
                                id="studentClass"
                                value={studentClass}
                                label="??????????????????"
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
                            label="?????????????????? ???????????????????????????????????? ?????????"
                            {...register("instituteName")}
                            helperText={errors?.instituteName?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="educationMedium">????????????????????? ??????????????????</InputLabel>
                            <Select
                                labelId="educationMedium"
                                id="educationMedium"
                                value={educationMedium}
                                label="????????????????????? ??????????????????"
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
                        <FilePondUploader
                            required={true}
                            title='* upload a passport size photo'
                            id="passportSizePhotoUrl"
                            getUrl={getSecureUrl}
                        />
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
