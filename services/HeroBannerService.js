import useSWR from 'swr';
import axios from "axios";
import Cookies from 'js-cookie';

const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;

const fetcher = async (url) => {
    await axios.get(url, {
        headers: {authorization: `Bearer ${userInfo.token}`},
    });
}

export function useFetchSingleHeroBanner (id) {
    console.log('the id in service: ', id);
    const { data, error, mutate } = useSWR(`/api/admin/hero-banner/${id}`, fetcher);
    console.log('data in service: ', data);

    return {
        heroBanner: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}

export function useFetchHeroBanners () {
    const { data, error, mutate } = useSWR(`/api/admin/hero-banner`, fetcher)

    return {
        heroBanner: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}