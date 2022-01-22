/*
import {useCallback, useContext, useMemo, useState} from "react";
import axios from "axios";
import {useSnackbar} from "notistack";
import {useRouter} from "next/router";
import {Store} from "../../../utils/Store";
import {getError} from "../../../utils/error";
import CustomChipRowStatus from '../../../components/common/CustomChipRowStatus';
import DatatableButtonGroup from '../../../components/common/button/DatatableButtonGroup';
import ReadButton from '../../../components/common/button/ReadButton';
import EditButton from '../../../components/common/button/EditButton';
import AddButton from '../../../components/common/button/AddButton';
import PageBlock from '../../../components/common/PageBlock';
import DeleteButton from '../../../components/common/button/DeleteButton';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import {Typography} from "@mui/material";
import MUIDataTable from "mui-datatables";

const PublicationsPage = () => {
        const {enqueueSnackbar} = useSnackbar();
        const [selectedItemId, setSelectedItemId] = useState(null);
        const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
        const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
        const [isToggleTable, setIsToggleTable] = useState(false);
        const {state} = useContext(Store);
        const router = useRouter();

        const {userInfo} = state;

        const closeAddEditModal = useCallback(() => {
            setIsOpenAddEditModal(false);
            setSelectedItemId(null);
        }, []);

        const openAddEditModal = useCallback((itemId = null) => {
            setIsOpenDetailsModal(false);
            setIsOpenAddEditModal(true);
            setSelectedItemId(itemId);
        }, []);

        const openDetailsModal = useCallback(
            (itemId) => {
                setIsOpenDetailsModal(true);
                setSelectedItemId(itemId);
            },
            [selectedItemId],
        );

        const closeDetailsModal = useCallback(() => {
            setIsOpenDetailsModal(false);
        }, []);

        const deleteHeroBanner = async (heroBannerId) => {
            if (!window.confirm('Are you sure?')) {
                return;
            }
            try {
                await axios.delete(`/api/admin/hero-banner/${heroBannerId}`, {
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });

                enqueueSnackbar('Product deleted successfully', {variant: 'success'});
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
                    Header: '#',
                    disableFilters: true,
                    disableSortBy: true,
                    Cell: (props) => {
                        return props.row.index + 1;
                    },
                },
                {
                    Header: "Image",
                    accessor: 'imgUrl',
                },
                {
                    Header: "Link",
                    accessor: 'link',
                    isVisible: true,
                },
                {
                    Header: "Status",
                    accessor: 'row_status',
                    filter: 'rowStatusFilter',
                    Cell: (props) => {
                        let data = props.row.original;
                        return <CustomChipRowStatus value={data?.row_status}/>;
                    },
                },
                {
                    Header: "Actions",
                    Cell: (props) => {
                        let data = props.row.original;
                        return (
                            <DatatableButtonGroup>
                                <ReadButton onClick={() => openDetailsModal(data.id)}/>
                                <EditButton onClick={() => openAddEditModal(data.id)}/>
                                <DeleteButton
                                    deleteAction={() => deleteHeroBanner(data.id)}
                                    deleteTitle="Are you sure?"
                                />
                            </DatatableButtonGroup>
                        );
                    },
                    sortable: false,
                },
            ],
            [],
        );

        const {onFetchData, data, loading, pageCount, totalCount} =
            useReactTableFetchData({
                urlPath: "/api/admin/hero-banner",
            });

        return (
            <>
                <PageBlock
                    title={
                        <>
                            <ViewCarouselIcon/>
                            <Typography>Hero Banners</Typography>
                        </>
                    }
                    extra={[
                        <AddButton
                            key={1}
                            onClick={() => openAddEditModal(null)}
                            isLoading={loading}
                            tooltip="Add a new Hero Banner"
                        />,
                    ]}>
                    <MUIDataTable
                        columns={columns}
                        data={data}
                        fetchData={onFetchData}
                        loading={loading}
                        pageCount={pageCount}
                        totalCount={totalCount}
                        toggleResetTable={isToggleTable}
                    />
                    {isOpenAddEditModal && (
                        <PublicationAddEditPopup
                            key={1}
                            onClose={closeAddEditModal}
                            itemId={selectedItemId}
                            refreshDataTable={refreshDataTable}
                        />
                    )}

                    {isOpenDetailsModal && selectedItemId && (
                        <PublicationDetailsPopup
                            key={1}
                            itemId={selectedItemId}
                            onClose={closeDetailsModal}
                            openEditModal={openAddEditModal}
                        />
                    )}
                </PageBlock>
            </>
        );
    }
;

export default PublicationsPage;
*/
