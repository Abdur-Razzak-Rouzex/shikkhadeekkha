import React from 'react';
import {Box, Card, CardContent, CardHeader, Divider} from '@mui/material';

const PageBlock = ({children, extra}) => {
    return (
        <Card>
            <CardHeader
                action={
                    extra && (
                        <Box
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            ml='auto'>
                            {extra}
                        </Box>
                    )
                }
            />
            <Divider/>
            <CardContent sx={{padding: 0}} style={{paddingBottom: 0}}>
                {children}
            </CardContent>
        </Card>
    );
};

export default React.memo(PageBlock);
