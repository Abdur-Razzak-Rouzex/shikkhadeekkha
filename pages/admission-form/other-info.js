import {
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
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
import {
    AVAILABLE_COURSES,
    CO_CURRICULAR_ACTIVITIES,
    DEVICE_TYPES,
    MOBILE_NUMBER_REGEX
} from "../../components/common/constants";

const initialValues = {
    selectedCourse: '',
    studentGroupWhatsappNo: '',
    studentGmailId: '',
    residentForCourier: '',
    typeOfElectronicsToBeUsedInLiveClass: '',
    coCurricularActivities: '',
};

/** style for multiple select dropdown form field */
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 550,
        },
    },
};

export default function OtherInfo() {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [coCurricularActivities, setCoCurricularActivities] = useState([]);
    const [typeOfElectronicsToBeUsedInLiveClass, setTypeOfElectronicsToBeUsedInLiveClass] = useState([]);

    const {
        userInfo,
        admission: {otherInfo},
    } = state;

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login?redirect=/admission-form/student-info');
        }
        if (otherInfo) {
            reset({
                selectedCourse: otherInfo?.selectedCourse,
                studentGroupWhatsappNo: otherInfo?.studentGroupWhatsappNo,
                studentGmailId: otherInfo?.studentGmailId,
                residentForCourier: otherInfo?.residentForCourier,
            })
        } else {
            reset(initialValues);
        }
    }, []);

    const handleChange = (id, event) => {
        setValue(id, event.target.value);
        setSelectedCourse(event.target.value);
    };

    const handleElectronicsChange = (id, event) => {
        setValue(id, event.target.value);
        const {
            target: {value},
        } = event;
        setTypeOfElectronicsToBeUsedInLiveClass(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleActivityChange = (id, event) => {
        setValue(id, event.target.value);
        const {
            target: {value},
        } = event;
        setCoCurricularActivities(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const validationSchema = useMemo(() => {
        return yup.object().shape({
            selectedCourse: yup
                .string()
                .required('কোর্স সিলেক্ট করুন অবশ্যই করতে হবে')
                .label("কোর্স সিলেক্ট করুন"),
            studentGroupWhatsappNo: yup
                .string()
                .matches(MOBILE_NUMBER_REGEX, 'আপনার সঠিক নাম্বারটি দিন')
                .required('শিক্ষার্থীর গ্রুপের জন্য Whatsapp নম্বর অবশ্যই দিতে হবে')
                .label("শিক্ষার্থীর গ্রুপের জন্য Whatsapp নম্বর"),
            studentGmailId: yup
                .string()
                .email('আপনার ইমেইলটি সঠিক নয়')
                .required('Google ক্লাসরুমের জন্য শিক্ষার্থীর জিমেইল আইডি অবশ্যই পূরণ করতে হবে')
                .label("Google ক্লাসরুমের জন্য শিক্ষার্থীর জিমেইল আইডি"),
            residentForCourier: yup
                .string()
                .required('আবাসিক ঠিকানা (কুরিয়ারের জন্য) অবশ্যই পূরণ করতে হবে')
                .label("আবাসিক ঠিকানা (কুরিয়ারের জন্য)"),
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
                               selectedCourse,
                               studentGroupWhatsappNo,
                               studentGmailId,
                               residentForCourier,
                               typeOfElectronicsToBeUsedInLiveClass,
                               coCurricularActivities
                           }) => {
        dispatch({
            type: 'SAVE_OTHER_INFO',
            payload: {
                selectedCourse,
                studentGroupWhatsappNo,
                studentGmailId,
                residentForCourier,
                typeOfElectronicsToBeUsedInLiveClass,
                coCurricularActivities
            },
        });
        Cookies.set(
            'otherInfo',
            JSON.stringify({
                selectedCourse,
                studentGroupWhatsappNo,
                studentGmailId,
                residentForCourier,
                typeOfElectronicsToBeUsedInLiveClass,
                coCurricularActivities
            })
        );
        router.push('/admission-form/submit-now');
    };

    return (
        <Layout title="অন্যান্য তথ্য">
            <AdmissionWizard activeStep={4}/>
            <Form onSubmit={handleSubmit(submitHandler)} sx={{marginTop: 5}}>
                <Typography component="h1" variant="h1">
                    অন্যান্য তথ্য
                </Typography>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.studentGroupWhatsappNo}
                            variant="outlined"
                            fullWidth
                            id="studentGroupWhatsappNo"
                            label="শিক্ষার্থীর গ্রুপের জন্য Whatsapp নম্বর"
                            {...register("studentGroupWhatsappNo")}
                            helperText={errors?.studentGroupWhatsappNo?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{minWidth: 271}}>
                            <InputLabel id="selectedCourse">কোর্স সিলেক্ট করুন</InputLabel>
                            <Select
                                labelId="selectedCourse"
                                id="selectedCourse"
                                value={selectedCourse}
                                label="কোর্স সিলেক্ট করুন"
                                onChange={(event) => handleChange("selectedCourse", event)}
                                error={!!errors?.selectedCourse}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {AVAILABLE_COURSES?.map((course, key) => (
                                    <MenuItem value={course.name} key={key}>{course.title}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText
                                sx={{color: '#d32f2f'}}>{errors?.selectedCourse?.message ?? null}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.studentGmailId}
                            variant="outlined"
                            fullWidth
                            id="studentGmailId"
                            label="Google ক্লাসরুমের জন্য শিক্ষার্থীর জিমেইল আইডি"
                            {...register("studentGmailId")}
                            helperText={errors?.studentGmailId?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{m: 1, width: 265}}>
                            <InputLabel id="typeOfElectronicsToBeUsedInLiveClass">লাইভ ক্লাসের জন্য যে ইলেকট্রনিক ডিভাইস</InputLabel>
                            <Select
                                required
                                labelId="typeOfElectronicsToBeUsedInLiveClass"
                                id="typeOfElectronicsToBeUsedInLiveClass"
                                multiple
                                value={typeOfElectronicsToBeUsedInLiveClass}
                                onChange={(event => handleElectronicsChange('typeOfElectronicsToBeUsedInLiveClass', event))}
                                input={<OutlinedInput
                                    label="লাইভ ক্লাসের জন্য যে ধরনের ইলেকট্রনিক মডিউল ব্যবহার করা হবে "/>}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {DEVICE_TYPES.map((device) => (
                                    <MenuItem key={device} value={device}>
                                        <Checkbox checked={typeOfElectronicsToBeUsedInLiveClass.indexOf(device) > -1}/>
                                        <ListItemText primary={device}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            InputLabelProps={{
                                required: true,
                            }}
                            error={!!errors?.residentForCourier}
                            variant="outlined"
                            fullWidth
                            id="residentForCourier"
                            label="আবাসিক ঠিকানা (কুরিয়ারের জন্য)"
                            {...register("residentForCourier")}
                            helperText={errors?.residentForCourier?.message ?? null}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl sx={{m: 1, width: 265}}>
                            <InputLabel id="coCurricularActivities">সহ-পাঠ্যক্রমিক ক্রিয়াকলাপ</InputLabel>
                            <Select
                                labelId="coCurricularActivities"
                                id="coCurricularActivities"
                                multiple
                                value={coCurricularActivities}
                                onChange={(event => handleActivityChange('coCurricularActivities', event))}
                                input={<OutlinedInput
                                    label="সহ-পাঠ্যক্রমিক ক্রিয়াকলাপ যেগুলোতে আপনি যোগ দিতে চান"/>}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {CO_CURRICULAR_ACTIVITIES.map((activities) => (
                                    <MenuItem key={activities} value={activities}>
                                        <Checkbox checked={coCurricularActivities.indexOf(activities) > -1}/>
                                        <ListItemText primary={activities}/>
                                    </MenuItem>
                                ))}
                            </Select>
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
                    <Grid item xs={12} md={5}>
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
