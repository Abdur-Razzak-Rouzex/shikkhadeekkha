import {SnackbarProvider} from 'notistack';
import {StoreProvider} from '../utils/Store';
import {CacheProvider} from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import '../styles.css'

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return (
        <CacheProvider value={emotionCache}>
            <SnackbarProvider
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <StoreProvider>
                    <Component {...pageProps} />
                </StoreProvider>
            </SnackbarProvider>
        </CacheProvider>
    );
}

export default MyApp;
