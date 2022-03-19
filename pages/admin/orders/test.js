import NextLink from 'next/link';
import React, {useContext, useEffect, useMemo, useState} from "react";
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

const AdminOrders = () => {
    const {enqueueSnackbar} = useSnackbar();
    const {state} = useContext(Store);
    const router = useRouter();
    const {userInfo} = state;
    const [loader, setLoader] = useState(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (!userInfo?.name) {
            router.push('/login');
        }
        const getOrders = async () => {
            setLoader(true);
            let modifiedData = [];
            try {
                const {data} = await axios.get('/api/admin/orders', {
                    headers: {authorization: `Bearer ${userInfo?.token}`},
                })

                data.map((item, index) => {
                    modifiedData.push({sl: index + 1, ...item});
                })

                console.log("modifiedData: ", modifiedData);

                setData(modifiedData);
                setLoader(false);
            } catch (error) {
                enqueueSnackbar(getError(error), {variant: 'error'});
                setLoader(false);
            }
        };
        getOrders();
    }, [])

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
                name: "user.name",
                label: "User",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "order.createdAt",
                label: "Order Date",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "order.paidAt",
                label: "Paid At",
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
                                <NextLink href={`/order/${id}`} passHref>
                                    <ReadButton/>
                                </NextLink>
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
            <Layout title="Hero Banners">
                <Grid container spacing={1}>
                    <Grid item md={3} xs={12}>
                        <Card sx={classes.section}>
                            <AdminMenuItems activeItem="hero-banners"/>
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
                                        /*<AddButton
                                            key={1}
                                            onClick={() => openAddEditModal(null)}
                                            tooltip="Add a new Hero Banner"
                                        />,*/
                                    ]}>

                                    <MUIDataTable
                                        title={"Orders"}
                                        columns={columns}
                                        data={data}
                                        options={muiDataTableOptions}
                                    />
                                </PageBlock>
                            )}
                    </Grid>
                </Grid>
            </Layout>
        </>
    );
}

export default dynamic(() => Promise.resolve(AdminOrders), {ssr: false});
