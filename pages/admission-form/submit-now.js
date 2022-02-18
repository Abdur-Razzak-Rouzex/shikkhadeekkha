import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {Box, Button, Card, CircularProgress, Grid, List, ListItem, Typography,} from '@mui/material';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {Store} from "../../utils/Store";
import {getError} from "../../utils/error";
import Layout from "../../components/Layout";
import classes from '../../utils/classes';
import {styleClasses} from '../../components/common/elements/DetailsInputView'
import AdmissionWizard from "../../components/AdmissionWizard";
import DetailsInputView, {StyledGrid} from "../../components/common/elements/DetailsInputView";
import FormLabel from "@mui/material/FormLabel";
import Cookies from "js-cookie";
import {PARENTS_TYPE} from "../../components/common/constants";

function PlaceOrder() {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {
        userInfo,
        admission: {studentInfo, parentsInfo, academicGuardianInfo, otherInfo},
    } = state;

    const {closeSnackbar, enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo?.name || !userInfo?.token) {
            router.push('/login?redirect=/admission-form/student-info');
        }
        if (!studentInfo?.studentNameBn) {
            router.push('/admission-form/student-info');
        }
        if (!parentsInfo?.fatherName) {
            router.push('/admission-form/parents-info');
        }
        if (parentsInfo?.academicallyResponsiblePerson === PARENTS_TYPE[3].name) {
            if (!academicGuardianInfo?.guardianName) {
                router.push('/admission-form/academic-guardian-info');
            }
        }
        if (!otherInfo?.selectedCourse) {
            router.push('/admission-form/other-info');
        }
    }, []);

    const admissionFormHandler = async () => {
        closeSnackbar();
        try {
            const data = {
                studentInfo,
                parentsInfo,
                academicGuardianInfo,
                otherInfo
            };

            setLoading(true);
            await axios.post(
                '/api/admission',
                data,
                {
                    headers: {
                        authorization: `Bearer ${userInfo?.token}`,
                    },
                }
            );

            dispatch({type: 'ADMISSION_CLEAR'});
            Cookies.remove('studentInfo');
            Cookies.remove('parentsInfo');
            Cookies.remove('academicGuardianInfo');
            Cookies.remove('otherInfo');
            setLoading(false);
            enqueueSnackbar('আপনার ভর্তি আবেদন পত্র সফল ভাবে জমা হয়েছে', {variant: 'success'});
            router.push('/welcome');
        } catch (err) {
            setLoading(false);
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    };
    return (
        <Layout title="সাবমিট করুন">
            <AdmissionWizard activeStep={5}/>
            <Typography
                component="h1"
                variant="h6"
                mt={5}
                sx={{color: 'red', fontSize: 'bold', textAlign: 'center'}}
            >
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                বিঃ দ্রঃ আপনার দেওয়া তথ্যগুলি সঠিক আছে কি না, যাচায় করে নিন এবং "জমা দিন" বাটনটি চাপুন
            </Typography>

            <Grid container sx={{justifyContent: 'center'}}>
                <Grid item xs={12} md={8}>
                    {/** student info */}
                    <Card sx={classes.section}>
                        <List>
                            <ListItem sx={{justifyContent: 'center'}}>
                                <Typography component="h2" variant="h2">
                                    শিক্ষার্থীর তথ্য
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শিক্ষার্থীর নাম  (বাংলা)"
                                            value={studentInfo?.studentNameBn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শিক্ষার্থীর নাম  (ইংরেজী)"
                                            value={studentInfo?.studentNameEn}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="জন্মতারিখ"
                                            value={studentInfo?.dateOfBirth}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শ্রেণী"
                                            value={studentInfo?.studentClass}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শিক্ষা প্রতিষ্ঠানের নাম"
                                            value={studentInfo?.instituteName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শিক্ষার মাধ্যম"
                                            value={studentInfo?.educationMedium}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <img src={studentInfo?.passportSizePhotoUrl}
                                             alt={studentInfo?.studentNameBn}
                                             height={300} width={300}
                                             title={studentInfo?.studentNameBn}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </Card>

                    {/** parents info */}
                    <Card sx={classes.section}>
                        <List>
                            <ListItem sx={{justifyContent: 'center'}}>
                                <Typography component="h2" variant="h2">
                                    পিতামাতার তথ্য
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="বাবার নাম"
                                            value={parentsInfo?.fatherName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="বাবার পেশা"
                                            value={parentsInfo?.fatherProfession}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="মায়ের নাম"
                                            value={parentsInfo?.motherName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="মায়ের পেশা"
                                            value={parentsInfo?.motherProfession}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="একাডেমিক উদ্দেশ্যে অভিভাবকের ফোন নাম্বার"
                                            value={parentsInfo?.parentsDirectContact}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="পিতামাতার Whatsapp নাম্বার"
                                            value={parentsInfo?.parentsWhatsappNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="মা/বাবার ই - মেইল"
                                            value={parentsInfo?.parentsEmail}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ করবেন"
                                            value={parentsInfo?.academicallyResponsiblePerson}
                                        />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </Card>

                    {/** Academic Guardian info */}
                    {parentsInfo?.academicallyResponsiblePerson === PARENTS_TYPE[3].name && (
                        <Card sx={classes.section}>
                            <List>
                                <ListItem sx={{justifyContent: 'center'}}>
                                    <Typography component="h2" variant="h2">
                                        একাডেমিক অভিভাবক
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <DetailsInputView
                                                label="অভিভাবকের নাম"
                                                value={academicGuardianInfo?.guardianName}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DetailsInputView
                                                label="সম্পর্ক"
                                                value={academicGuardianInfo?.relation}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DetailsInputView
                                                label="মোবাইল নাম্বার"
                                                value={academicGuardianInfo?.guardianMobileNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DetailsInputView
                                                label="হোয়াটসঅ্যাপ নাম্বার"
                                                value={academicGuardianInfo?.guardianWhatsappNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DetailsInputView
                                                label="ইমেইল"
                                                value={academicGuardianInfo?.guardianEmail}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            </List>
                        </Card>
                    )}

                    {/** Other info */}
                    <Card sx={classes.section}>
                        <List>
                            <ListItem sx={{justifyContent: 'center'}}>
                                <Typography component="h2" variant="h2">
                                    অন্যান্য তথ্য
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="কোর্স সিলেক্ট"
                                            value={otherInfo?.selectedCourse}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="শিক্ষার্থীর গ্রুপের জন্য Whatsapp নম্বর"
                                            value={otherInfo?.studentGroupWhatsappNo}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="Google ক্লাসরুমের জন্য শিক্ষার্থীর জিমেইল আইডি"
                                            value={otherInfo?.studentGmailId}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailsInputView
                                            label="আবাসিক ঠিকানা (কুরিয়ারের জন্য)"
                                            value={otherInfo?.residentForCourier}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <StyledGrid item xs={12}>
                                            <FormLabel className={styleClasses?.label}>
                                                লাইভ ক্লাসের জন্য যে ধরনের ইলেকট্রনিক মডিউল ব্যবহার করা হবে
                                            </FormLabel>
                                            {otherInfo?.typeOfElectronicsToBeUsedInLiveClass?.map(((device, index) => (
                                                <div className={styleClasses?.inputView}
                                                     key={device}>
                                                    &emsp;{`${index + 1}  :  ${device}`}
                                                </div>
                                            )))}
                                        </StyledGrid>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <StyledGrid item xs={12}>
                                            <FormLabel className={styleClasses?.label}>
                                                সহ-পাঠ্যক্রমিক ক্রিয়াকলাপ যেগুলোতে আপনি যোগ দিতে চান
                                            </FormLabel>
                                            {typeof otherInfo?.coCurricularActivities === 'undefined' ? (
                                                <Box sx={{textAlign: 'center'}} mt={3}>
                                                    <Box className={styleClasses?.inputView}>
                                                        &emsp;কোন কিছুই যোগ করেননি
                                                    </Box>
                                                </Box>
                                            ) : (
                                                otherInfo?.coCurricularActivities?.map(((coCurriculm, index) => (
                                                    <Box className={styleClasses?.inputView}
                                                         key={coCurriculm}>
                                                        &emsp;{`${index + 1}  :  ${coCurriculm}`}
                                                    </Box>
                                                )))
                                            )}
                                        </StyledGrid>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    </Card>

                    {/** submit button */}
                    <List>
                        <ListItem sx={{padding: 0}}>
                            <Button
                                onClick={admissionFormHandler}
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                জমা দিন
                            </Button>
                        </ListItem>
                        {loading && (
                            <ListItem>
                                <CircularProgress/>
                            </ListItem>
                        )}
                    </List>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});
