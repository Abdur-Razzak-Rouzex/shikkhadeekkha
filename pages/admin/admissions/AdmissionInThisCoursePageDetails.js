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
                                            ????????????????????????????????? ????????????
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="????????????????????????????????? ?????????  (???????????????)"
                                                    value={itemData?.studentInfo?.studentNameBn}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="????????????????????????????????? ?????????  (??????????????????)"
                                                    value={itemData?.studentInfo?.studentNameEn}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="???????????????????????????"
                                                    value={itemData?.studentInfo?.dateOfBirth}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????????"
                                                    value={itemData?.studentInfo?.studentClass}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="?????????????????? ???????????????????????????????????? ?????????"
                                                    value={itemData?.studentInfo?.instituteName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="????????????????????? ??????????????????"
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
                                            ??????????????????????????? ????????????
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????? ?????????"
                                                    value={itemData?.parentsInfo?.fatherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????? ????????????"
                                                    value={itemData?.parentsInfo?.fatherProfession}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????? ?????????"
                                                    value={itemData?.parentsInfo?.motherName}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????? ????????????"
                                                    value={itemData?.parentsInfo?.motherProfession}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="???????????????????????? ??????????????????????????? ??????????????????????????? ????????? ?????????????????????"
                                                    value={itemData?.parentsInfo?.parentsDirectContact}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????????????????? Whatsapp ?????????????????????"
                                                    value={itemData?.parentsInfo?.parentsWhatsappNumber}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????/??????????????? ??? - ????????????"
                                                    value={itemData?.parentsInfo?.parentsEmail}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="???????????????????????? ??????????????????????????? ???????????? ????????????????????? ???????????????"
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
                                                ???????????????????????? ?????????????????????
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="??????????????????????????? ?????????"
                                                        value={itemData?.academicGuardianInfo?.guardianName}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="?????????????????????"
                                                        value={itemData?.academicGuardianInfo?.relation}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="?????????????????? ?????????????????????"
                                                        value={itemData?.academicGuardianInfo?.guardianMobileNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="???????????????????????????????????? ?????????????????????"
                                                        value={itemData?.academicGuardianInfo?.guardianWhatsappNumber}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <DetailsInputView
                                                        label="???????????????"
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
                                            ???????????????????????? ????????????
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="??????????????? ?????????????????????"
                                                    value={itemData?.otherInfo?.selectedCourse}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="????????????????????????????????? ????????????????????? ???????????? Whatsapp ???????????????"
                                                    value={itemData?.otherInfo?.studentGroupWhatsappNo}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="Google ?????????????????????????????? ???????????? ????????????????????????????????? ?????????????????? ????????????"
                                                    value={itemData?.otherInfo?.studentGmailId}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <DetailsInputView
                                                    label="?????????????????? ?????????????????? (?????????????????????????????? ????????????)"
                                                    value={itemData?.otherInfo?.residentForCourier}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <StyledGrid item xs={12}>
                                                    <FormLabel className={styleClasses?.label}>
                                                        ???????????? ????????????????????? ???????????? ?????? ??????????????? ?????????????????????????????? ??????????????? ????????????????????? ????????? ?????????
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
                                                        ??????-????????????????????????????????? ????????????????????????????????? ???????????????????????? ???????????? ????????? ???????????? ?????????
                                                    </FormLabel>
                                                    {typeof itemData?.otherInfo?.coCurricularActivities === 'undefined' ? (
                                                        <Box sx={{textAlign: 'center'}} mt={3}>
                                                            <Box className={styleClasses?.inputView}>
                                                                &emsp;????????? ??????????????? ????????? ??????????????????
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
