import Image from 'next/image';
import React from 'react';
import {Grid, TextField, Typography} from '@mui/material';
import {useFetchSingleHeroBanner} from "../../../services/HeroBannerService";
import CustomDetailsViewMuiModal from "../../../components/common/modals/CustomDetailsViewMuiModal";
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CancelButton from "../../../components/common/button/CancelButton";
import EditButton from "../../../components/common/button/EditButton";

const HeroBannerDetailsPopup = ({itemId, openEditModal, ...props}) => {
  const {data: itemData, isLoading} = useFetchSingleHeroBanner(itemId);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <ViewCarouselIcon />
            <Typography>Hero Banner details</Typography>
          </>
        }
        maxWidth={'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            {itemData && (
              <EditButton
                variant='contained'
                onClick={() => openEditModal(itemData?.id)}
                isLoading={isLoading}
              />
            )}
          </>
        }>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Image
                src={itemData.imgUrl}
                alt={itemData.altTitle}
                width={300}
                height={200}
                layout="responsive"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
                variant="outlined"
                id="link"
                label="Link"
                aria-readonly={true}
                value={itemData.link}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
                variant="outlined"
                id="link"
                label="Link"
                aria-readonly={true}
                value={itemData.altTitle}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default HeroBannerDetailsPopup;
