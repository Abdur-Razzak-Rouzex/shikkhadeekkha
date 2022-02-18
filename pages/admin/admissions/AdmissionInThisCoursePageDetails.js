import React, {useEffect, useState} from 'react';
import {Box, Card, Grid, List, ListItem, Typography} from '@mui/material';
import CustomDetailsViewMuiModal from "../../../components/common/modals/CustomDetailsViewMuiModal";
import CancelButton from "../../../components/common/button/CancelButton";
import axios from "axios";
import {getError} from "../../../utils/error";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import DetailsInputView, {styleClasses, StyledGrid} from "../../../components/common/elements/DetailsInputView";
import classes from "../../../utils/classes";
import FormLabel from "@mui/material/FormLabel";
import {PARENTS_TYPE} from "../../../components/common/constants";

const AdmissionInThisCourseDetails = ({itemId, userInfo, ...props}) => {
    const router = useRouter();
    const [itemData, setItemData] = useState({});
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        const getBanner = async () => {
            try {
                const {data} = await axios.get(`/api/admission/${itemId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                })
                setItemData(data);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
            }
        };

        getBanner();

    }, [itemId])

    return (
        <>
            {itemData && (
                <CustomDetailsViewMuiModal
                    open={true}
                    {...props}
                    title={
                        <>
                            <Typography component={'span'} variant={'h5'}>Admission Form details</Typography>
                        </>
                    }
                    maxWidth={'md'}
                    actions={
                        <>
                            <CancelButton onClick={props.onClose}/>
                        </>
                    }>
                    <Grid container sx={{justifyContent: 'center'}}>
                        <Grid item xs={12} md={12}>
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
                                                    value={itemData?.studentInfo?.studentNameBn}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="শিক্ষার্থীর নাম  (ইংরেজী)"
                                                    value={itemData?.studentInfo?.studentNameEn}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="জন্মতারিখ"
                                                    value={itemData?.studentInfo?.dateOfBirth}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="শ্রেণী"
                                                    value={itemData?.studentInfo?.studentClass}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="শিক্ষা প্রতিষ্ঠানের নাম"
                                                    value={itemData?.studentInfo?.instituteName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="শিক্ষার মাধ্যম"
                                                    value={itemData?.studentInfo?.educationMedium}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <img src={itemData?.studentInfo?.passportSizePhotoUrl}
                                                     alt={itemData?.studentInfo?.studentNameBn}
                                                     height={300} width={300}
                                                     title={itemData?.studentInfo?.studentNameBn}
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
                                                    value={itemData?.parentsInfo?.fatherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="বাবার পেশা"
                                                    value={itemData?.parentsInfo?.fatherProfession}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="মায়ের নাম"
                                                    value={itemData?.parentsInfo?.motherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="মায়ের পেশা"
                                                    value={itemData?.parentsInfo?.motherProfession}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="একাডেমিক উদ্দেশ্যে অভিভাবকের ফোন নাম্বার"
                                                    value={itemData?.parentsInfo?.parentsDirectContact}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="পিতামাতার Whatsapp নাম্বার"
                                                    value={itemData?.parentsInfo?.parentsWhatsappNumber}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="মা/বাবার ই - মেইল"
                                                    value={itemData?.parentsInfo?.parentsEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="একাডেমিক উদ্দেশ্যে যিনি যোগাযোগ করবেন"
                                                    value={itemData?.parentsInfo?.academicallyResponsiblePerson}
                                                />
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </List>
                            </Card>

                            {/** Academic Guardian info */}
                            {itemData?.parentsInfo?.academicallyResponsiblePerson === PARENTS_TYPE[3].name && (
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
                                                        value={itemData?.academicGuardianInfo?.guardianName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="সম্পর্ক"
                                                        value={itemData?.academicGuardianInfo?.relation}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="মোবাইল নাম্বার"
                                                        value={itemData?.academicGuardianInfo?.guardianMobileNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="হোয়াটসঅ্যাপ নাম্বার"
                                                        value={itemData?.academicGuardianInfo?.guardianWhatsappNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="ইমেইল"
                                                        value={itemData?.academicGuardianInfo?.guardianEmail}
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
                                                    value={itemData?.otherInfo?.selectedCourse}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="শিক্ষার্থীর গ্রুপের জন্য Whatsapp নম্বর"
                                                    value={itemData?.otherInfo?.studentGroupWhatsappNo}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="Google ক্লাসরুমের জন্য শিক্ষার্থীর জিমেইল আইডি"
                                                    value={itemData?.otherInfo?.studentGmailId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="আবাসিক ঠিকানা (কুরিয়ারের জন্য)"
                                                    value={itemData?.otherInfo?.residentForCourier}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <StyledGrid item xs={12}>
                                                    <FormLabel className={styleClasses?.label}>
                                                        লাইভ ক্লাসের জন্য যে ধরনের ইলেকট্রনিক মডিউল ব্যবহার করা হবে
                                                    </FormLabel>
                                                    {itemData?.otherInfo?.typeOfElectronicsToBeUsedInLiveClass?.map(((device, index) => (
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
                                                    {typeof itemData?.otherInfo?.coCurricularActivities === 'undefined' ? (
                                                        <Box sx={{textAlign: 'center'}} mt={3}>
                                                            <Box className={styleClasses?.inputView}>
                                                                &emsp;কোন কিছুই যোগ করেননি
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        itemData?.otherInfo?.coCurricularActivities?.map(((coCurriculm, index) => (
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
                        </Grid>
                    </Grid>
                </CustomDetailsViewMuiModal>
            )}
        </>
    );
};

export default AdmissionInThisCourseDetails;
