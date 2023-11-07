import axios, { AxiosRequestConfig } from 'axios';
const API_ROUTE = 'http://localhost:3069';

const parseRoute = (route: string) => `${API_ROUTE}${route}`;

const fetcher = (
	url: string,
	data?: object,
	options?: AxiosRequestConfig<object> | undefined
) =>
	(!data ? axios.get(url, options) : axios.post(url, data, options)).then(
		(res) => res.data
	);

const fetcherGet = (
	url: string,
	options?: AxiosRequestConfig<object> | undefined
) => axios.get(url, options).then((res) => res.data);

const fetchApi = (
	route: string,
	data?: object | Array<any>,
	options?: AxiosRequestConfig<object> | undefined
) => fetcher(parseRoute(route), data, options);

export { fetcher, fetcherGet, fetchApi };
