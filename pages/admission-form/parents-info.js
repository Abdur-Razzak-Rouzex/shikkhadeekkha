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
        setValue(id, event.target.value);
        setAcademicallyResponsiblePerson(event.target.value);
    };

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            fatherName: yup
                .string()
                .required('বাবার নাম অবশ্যই পূরণ করতে হবে')
                .label("বাবার নাম"),
            fatherProfession: yup
                .string()
                .required('বাবার পেশা অবশ্যই পূরণ করতে হবে')
                .label("বাবার পেশা"),
            motherName: yup
                .string()
                .required('মায়ের নাম অবশ্যই পূরণ করতে হবে')
                .label("মায়ের নাম"),
            motherProfession: yup
                .string()
                .required('মায়ের পেশা অবশ্যই পূরণ করতে হবে')
                .label("মায়ের পেশা"),
            parentsDirectContact: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, 'আপনার সঠিক নাম্বারটি দিন')
                .required('একাডেমিক উদ্দেশ্যে অভিভাবকের ফোন নাম্বার অবশ্যই পূরণ করতে হবে')
                .label("একাডেমিক উদ্দেশ্যে অভিভাবকের ফোন নাম্বার"),
            parentsWhatsappNumber: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, 'আপনার সঠিক নাম্বারটি দিন')
                .required('পিতামাতার Whatsapp নাম্বার অবশ্যই পূরণ করতে হবে')
                .label("পিতামাতার Whatsapp নাম্বার"),
            parentsEmail: yup
                .string()
                .email('আপনার ইমেইল্টি সঠিক নয়')
                .required('মা/বাবার ই - মেইল অবশ্যই পূরণ করতে হবে')
                .label("মা/বাবার ই - মেইল"),
            academicallyResponsiblePerson: yup
                .string()
                .required('একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ করবেন তা অবশ্যই পূরণ করতে হবে')
                .label("একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ করবেন"),
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
        router.push('/admission-form/academic-guardian-info');
    };

    return (
        <Layout title="পিতামাতার তথ্য">
            <AdmissionWizard activeStep={2}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    পিতামাতার তথ্য
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
                            label="বাবার নাম"
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
                            label="বাবার পেশা"
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
                            label="মায়ের নাম"
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
                            label="মায়ের পেশা"
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
                            label="একাডেমিক উদ্দেশ্যে অভিভাবকের ফোন নাম্বার "
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
                            label="পিতামাতার Whatsapp নাম্বার"
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
                            label=" মা / বাবার ই - মেইল"
                            {...register("parentsEmail")}
                            helperText={errors?.parentsEmail?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="academicallyResponsiblePerson">একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ
                                করবেন</InputLabel>
                            <Select
                                labelId="academicallyResponsiblePerson"
                                id="academicallyResponsiblePerson"
                                value={academicallyResponsiblePerson}
                                label="একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ করবেন"
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
