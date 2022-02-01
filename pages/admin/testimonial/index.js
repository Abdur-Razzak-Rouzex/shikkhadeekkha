import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {Store} from "../../../utils/Store";
import {getError} from "../../../utils/error";
import AddButton from '../../../components/common/button/AddButton';
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
import EditButton from "../../../components/common/button/EditButton";
import DeleteButton from "../../../components/common/button/DeleteButton";
import TestimonialDetailsPopup from "./TestimonialDetailsPopup";
import TestimonialAddEditPopup from "./TestimonialAddEditPopup";

const WhyChooseUs = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
    const [isToggleTable, setIsToggleTable] = useState(false);
    const {state} = useContext(Store);
    const router = useRouter();
    const {userInfo} = state;
    const [loader, setLoader] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const getTestimonials = async () => {
            setLoader(true);
            let modifiedData = [];
            try {
                const {data} = await axios.get('/api/testimonial', {
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
        getTestimonials();
    }, [isToggleTable])

    const closeAddEditModal = useCallback(() => {
        setIsOpenAddEditModal(false);
        setSelectedItemId(null);
    }, []);

    const openAddEditModal = useCallback((itemId = null) => {
        setIsOpenDetailsModal(false);
        setIsOpenAddEditModal(true);
        setSelectedItemId(itemId);
    }, []);

    const openDetailsModal = useCallback((itemId) => {
            setIsOpenDetailsModal(true);
            setSelectedItemId(itemId);
        },
        [selectedItemId],
    );

    const closeDetailsModal = useCallback(() => {
        setIsOpenDetailsModal(false);
    }, []);

    /** delete a testimonial action */
    const deleteTestimonial = async (testimonialId) => {
        try {
            await axios.delete(`/api/testimonial/${testimonialId}`, {
                headers: {authorization: `Bearer ${userInfo.token}`},
            });

            enqueueSnackbar('Testimonial deleted successfully', {variant: 'success'});
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
                name: "name",
                label: "Name",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "designation",
                label: "Designation",
                options: {
                    filter: true,
                    sort: true,
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
                        const id = tableMeta.rowData[0];
                        return (
                            <DatatableButtonGroup>
                                <ReadButton onClick={() => openDetailsModal(id)}/>
                                <EditButton onClick={() => openAddEditModal(id)}/>
                                <DeleteButton
                                    deleteAction={() => deleteTestimonial(id)}
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
            <Layout title="Testimonial">
                <Grid container spacing={1}>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <AdminMenuItems activeItem="testimonials"/>
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
                                <PageBlock
                                    extra={[
                                        <AddButton
                                            key={1}
                                            onClick={() => openAddEditModal(null)}
                                            tooltip="Add a new Testimonial"
                                        />,
                                    ]}>

                                    <MUIDataTable
                                        title={"Testimonial"}
                                        columns={columns}
                                        data={data}
                                        options={muiDataTableOptions}
                                    />

                                    {isOpenAddEditModal && (
                                        <TestimonialAddEditPopup
                                            key={1}
                                            onClose={closeAddEditModal}
                                            itemId={selectedItemId}
                                            refreshDataTable={refreshDataTable}
                                        />
                                    )}

                                    {isOpenDetailsModal && selectedItemId && (
                                        <TestimonialDetailsPopup
                                            key={1}
                                            itemId={selectedItemId}
                                            onClose={closeDetailsModal}
                                            openEditModal={openAddEditModal}
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

export default dynamic(() => Promise.resolve(WhyChooseUs), {ssr: false});
