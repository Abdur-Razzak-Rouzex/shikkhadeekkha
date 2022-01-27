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
import WhyChooseUsDetailsPopup from "./WhyChooseUsDetailsPopup";
import WhyChooseUsAddEditPopup from "./WhyChooseUsAddEditPopup";
import CustomChipRowStatus from "../../../components/common/CustomChipRowStatus";

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
        const getWhyChooseUs = async () => {
            setLoader(true);
            let modifiedData = [];
            try {
                const {data} = await axios.get('/api/why-choose-us', {
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
        getWhyChooseUs();
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

    /** delete a whyChooseUs action */
    const deleteWhyChooseUs = async (whyChooseUsId) => {
        try {
            await axios.delete(`/api/why-choose-us/${whyChooseUsId}`, {
                headers: {authorization: `Bearer ${userInfo.token}`},
            });

            enqueueSnackbar('Why Choose Us: deleted successfully', {variant: 'success'});
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
                name: "title",
                label: "Title",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "shortDescription",
                label: "Short Description",
                options: {
                    filter: true,
                    sort: true,
                    display: false
                }
            },
            {
                name: "isFlipBook",
                label: "Is Flip Book",
                options: {
                    sort: true,
                    customBodyRender: (value, tableMeta) => {
                        const isFlipBook = tableMeta.tableData[tableMeta.rowIndex].isFlipBook;
                        return (
                            <CustomChipRowStatus value={isFlipBook} />
                        );
                    },
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
                                    deleteAction={() => deleteWhyChooseUs(id)}
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
            <Layout title="Why Choose Us">
                <Grid container spacing={1}>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <AdminMenuItems activeItem="why-choose-us"/>
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
                                            tooltip="Add a new 'Why Choose Us'"
                                        />,
                                    ]}>

                                    <MUIDataTable
                                        title={"Why Choose Us"}
                                        columns={columns}
                                        data={data}
                                        options={muiDataTableOptions}
                                    />

                                    {isOpenAddEditModal && (
                                        <WhyChooseUsAddEditPopup
                                            key={1}
                                            onClose={closeAddEditModal}
                                            itemId={selectedItemId}
                                            refreshDataTable={refreshDataTable}
                                        />
                                    )}

                                    {isOpenDetailsModal && selectedItemId && (
                                        <WhyChooseUsDetailsPopup
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
