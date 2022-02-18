import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {Store} from "../../../utils/Store";
import {getError} from "../../../utils/error";
import PageBlock from '../../../components/common/PageBlock';
import {Box, Card, Grid} from "@mui/material";
import MUIDataTable from "mui-datatables";
import Layout from "../../../components/Layout";
import classes from "../../../utils/classes";
import AdminMenuItems from "../../../components/admin/AdminMenuItems";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import CircularProgress from '@mui/material/CircularProgress';
import {muiDataTableOptions} from "../../../components/common/constants";
import DatatableButtonGroup from "../../../components/common/button/DatatableButtonGroup";
import ReadButton from "../../../components/common/button/ReadButton";
import DeleteButton from "../../../components/common/button/DeleteButton";
import AdmissionInThisCourseDetails from "./AdmissionInThisCourseDetailsPage";

const AdmissionInThisCoursePage = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
    const [isToggleTable, setIsToggleTable] = useState(false);
    const {state} = useContext(Store);
    const router = useRouter();
    const {userInfo} = state;
    const [loader, setLoader] = useState(false);
    const [courseName, setCourseName] = useState(null);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }

        setCourseName(router?.query?.course);

        if (courseName) {
            const getAdmissionInThisCourse = async () => {
                setLoader(true);
                let modifiedData = [];
                try {
                    const {data} = await axios.get(`/api/admission/course/${courseName}`, {
                        headers: {authorization: `Bearer ${userInfo.token}`},
                    })

                    data.map((item, index) => {
                        modifiedData.push({sl: index + 1, ...item});
                    })

                    setData(modifiedData);
                    setLoader(false);
                } catch (error) {
                    enqueueSnackbar(getError(error), {variant: 'error'});
                    setLoader(false);
                }
            };
            getAdmissionInThisCourse();
        }
    }, [isToggleTable, router, courseName])


    const openDetailsModal = useCallback((itemId) => {
            setIsOpenDetailsModal(true);
            setSelectedItemId(itemId);
        },
        [selectedItemId],
    );

    const closeDetailsModal = useCallback(() => {
        setIsOpenDetailsModal(false);
    }, []);

    /** delete an admission request action */
    const deleteAdmissinRequest = async (admissinFormId) => {
        try {
            await axios.delete(`/api/admission/${admissinFormId}`, {
                headers: {authorization: `Bearer ${userInfo.token}`},
            });

            enqueueSnackbar('Admission Request deleted successfully', {variant: 'success'});
            refreshDataTable();
        } catch (err) {
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    }

    const refreshDataTable = useCallback(() => {
        setIsToggleTable((isToggleTable) => !isToggleTable);
    }, [isToggleTable]);

    const columns = useMemo(
        () => [
            {
                name: "_id",
                label: "ID",
                options: {
                    filter: false,
                    sort: false,
                    display: false
                },
            },
            {
                name: "sl",
                label: "Serial Number",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "studentInfo.studentNameBn",
                label: "Student Name",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "studentInfo.instituteName",
                label: "Institute Name",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "studentInfo.educationMedium",
                label: " Education Medium",
                options: {
                    filter: true,
                    sort: true,
                    display: false
                }
            },
            {
                name: "#",
                label: "Actions",
                options: {
                    filter: false,
                    sort: false,
                    searchable: false,
                    download: false,
                    print: false,
                    customBodyRender: (value, tableMeta) => {
                        const id = tableMeta.tableData[tableMeta.rowIndex]._id;
                        return (
                            <DatatableButtonGroup>
                                <ReadButton onClick={() => openDetailsModal(id)}/>
                                <DeleteButton
                                    deleteAction={() => deleteAdmissinRequest(id)}
                                    deleteTitle="Are you sure?"
                                />
                            </DatatableButtonGroup>
                        );
                    },
                }
            }
        ],
        [],
    );

    return (
        <>
            <Layout title='Admission Requests'>
                <Grid container spacing={1}>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <AdminMenuItems activeItem="admission"/>
                        </Card>
                    </Grid>
                    <Grid item md={9} xs={12}>
                        {loader ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: '100px'
                                    }}
                                >
                                    <CircularProgress color="secondary"/>
                                </Box>
                            ) :
                            (
                                <PageBlock>
                                    <MUIDataTable
                                        title={`Admission requests for ${courseName}`}
                                        columns={columns}
                                        data={data}
                                        options={muiDataTableOptions}
                                    />

                                    {isOpenDetailsModal && selectedItemId && (
                                        <AdmissionInThisCourseDetails
                                            key={1}
                                            itemId={selectedItemId}
                                            onClose={closeDetailsModal}
                                            userInfo={userInfo}
                                        />
                                    )}
                                </PageBlock>
                            )}
                    </Grid>
                </Grid>
            </Layout>
        </>
    );
}

export default dynamic(() => Promise.resolve(AdmissionInThisCoursePage), {ssr: false});
