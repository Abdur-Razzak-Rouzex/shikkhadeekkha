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
import {MOBILE_NUMBER_REGEX, PARENTS_TYPE} from "../../components/common/constants";

const initialValues = {
    fatherName: '',
    fatherProfession: '',
    motherName: '',
    motherProfession: '',
    parentsDirectContact: '',
    parentsWhatsappNumber: '',
    parentsEmail: '',
    academicallyResponsiblePerson: '',
};

export default function ParentsInfo() {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const [academicallyResponsiblePerson, setAcademicallyResponsiblePerson] = useState('');
    const {
        userInfo,
        admission: {parentsInfo, studentInfo},
    } = state;

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login?redirect=/admission-form/student-info');
        }

        if (!studentInfo?.studentNameBn) {
            router.push('/admission-form/student-info');
        }

        if (parentsInfo) {
            reset({
                fatherName: parentsInfo?.fatherName,
                fatherProfession: parentsInfo?.fatherProfession,
                motherName: parentsInfo?.motherName,
                motherProfession: parentsInfo?.motherProfession,
                parentsDirectContact: parentsInfo?.parentsDirectContact,
                parentsWhatsappNumber: parentsInfo?.parentsWhatsappNumber,
                parentsEmail: parentsInfo?.parentsEmail,
                academicallyResponsiblePerson: parentsInfo?.academicallyResponsiblePerson,
            })
        } else {
            reset(initialValues);
        }
    }, []);

    const handleChange = (id, event) => {
        console.log('setAcademicallyResponsiblePerson: ', event.target.value);
        setValue(id, event.target.value);
        setAcademicallyResponsiblePerson(event.target.value);
    };

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            fatherName: yup
                .string()
                .required('??????????????? ????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????? ?????????"),
            fatherProfession: yup
                .string()
                .required('??????????????? ???????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????? ????????????"),
            motherName: yup
                .string()
                .required('??????????????? ????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????? ?????????"),
            motherProfession: yup
                .string()
                .required('??????????????? ???????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????? ????????????"),
            parentsDirectContact: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, '??????????????? ???????????? ??????????????????????????? ?????????')
                .required('???????????????????????? ??????????????????????????? ??????????????????????????? ????????? ????????????????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("???????????????????????? ??????????????????????????? ??????????????????????????? ????????? ?????????????????????"),
            parentsWhatsappNumber: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, '??????????????? ???????????? ??????????????????????????? ?????????')
                .required('??????????????????????????? Whatsapp ????????????????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????????????????????????? Whatsapp ?????????????????????"),
            parentsEmail: yup
                .string()
                .email('??????????????? ???????????????????????? ???????????? ??????')
                .required('??????/??????????????? ??? - ???????????? ?????????????????? ???????????? ???????????? ?????????')
                .label("??????/??????????????? ??? - ????????????"),
            academicallyResponsiblePerson: yup
                .string()
                .required('???????????????????????? ??????????????????????????? ???????????? ????????????????????? ??????????????? ?????? ?????????????????? ???????????? ???????????? ?????????')
                .label("???????????????????????? ??????????????????????????? ???????????? ????????????????????? ???????????????"),
        })
    }, []);

    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const submitHandler = ({
                               fatherName,
                               fatherProfession,
                               motherName,
                               motherProfession,
                               parentsDirectContact,
                               parentsWhatsappNumber,
                               parentsEmail,
                               academicallyResponsiblePerson
                           }) => {
        dispatch({
            type: 'SAVE_PARENTS_INFO',
            payload: {
                fatherName,
                fatherProfession,
                motherName,
                motherProfession,
                parentsDirectContact,
                parentsWhatsappNumber,
                parentsEmail,
                academicallyResponsiblePerson
            },
        });
        Cookies.set(
            'parentsInfo',
            JSON.stringify({
                fatherName,
                fatherProfession,
                motherName,
                motherProfession,
                parentsDirectContact,
                parentsWhatsappNumber,
                parentsEmail,
                academicallyResponsiblePerson
            })
        );

        if (academicallyResponsiblePerson === PARENTS_TYPE[3].name) {
            router.push('/admission-form/academic-guardian-info');
        } else {
            router.push('/admission-form/other-info');
        }
    };

    return (
        <Layout title="??????????????????????????? ????????????">
            <AdmissionWizard activeStep={2}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    ??????????????????????????? ????????????
                </Typography>

                <Grid container spacing={5}>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.fatherName}
                            variant="outlined"
                            fullWidth
                            id="fatherName"
                            label="??????????????? ?????????"
                            {...register("fatherName")}
                            helperText={errors?.fatherName?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.fatherProfession}
                            variant="outlined"
                            fullWidth
                            id="fatherProfession"
                            label="??????????????? ????????????"
                            {...register("fatherProfession")}
                            helperText={errors?.fatherProfession?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.motherName}
                            variant="outlined"
                            fullWidth
                            id="motherName"
                            label="??????????????? ?????????"
                            {...register("motherName")}
                            helperText={errors?.motherName?.message ?? null}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.motherProfession}
                            variant="outlined"
                            fullWidth
                            id="motherProfession"
                            label="??????????????? ????????????"
                            {...register("motherProfession")}
                            helperText={errors?.motherProfession?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.parentsDirectContact}
                            variant="outlined"
                            fullWidth
                            id="parentsDirectContact"
                            label="???????????????????????? ??????????????????????????? ??????????????????????????? ????????? ????????????????????? "
                            {...register("parentsDirectContact")}
                            helperText={errors?.parentsDirectContact?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.parentsWhatsappNumber}
                            variant="outlined"
                            fullWidth
                            id="parentsWhatsappNumber"
                            label="??????????????????????????? Whatsapp ?????????????????????"
                            {...register("parentsWhatsappNumber")}
                            helperText={errors?.parentsWhatsappNumber?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.parentsEmail}
                            variant="outlined"
                            fullWidth
                            id="parentsEmail"
                            label=" ?????? / ??????????????? ??? - ????????????"
                            {...register("parentsEmail")}
                            helperText={errors?.parentsEmail?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="academicallyResponsiblePerson">
                                ???????????????????????? ??????????????????????????? ???????????? ????????????????????? ???????????????
                            </InputLabel>
                            <Select
                                labelId="academicallyResponsiblePerson"
                                id="academicallyResponsiblePerson"
                                value={academicallyResponsiblePerson}
                                label="???????????????????????? ??????????????????????????? ???????????? ????????????????????? ???????????????"
                                onChange={(event) => handleChange("academicallyResponsiblePerson", event)}
                                error={!!errors?.academicallyResponsiblePerson}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {PARENTS_TYPE?.map((parents, key) => (
                                    <MenuItem value={parents.name} key={key}>{parents.title}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText
                                sx={{color: '#d32f2f'}}>{errors?.academicallyResponsiblePerson?.message ?? null}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            color="secondary"
                            onClick={() => router.push('/admission-form/student-info')}
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
