import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { paths } from '../routes';
import { clearLocalUser, clearTokens, didAutoLoadOnRefreshExpired, getExpiresAt, getJWT, getLocalOrganisation, getRefreshToken, setAutoLoadOnRefreshExpired, setExpiresInSeconds, setJWT, setRefreshToken } from '../storage/local.storage';
import { TokenResponse } from '../typings';
import { BasicApiResponse } from '../typings/api';
import { getConfig } from "../utils/config";
import { AUTH, USER, PROJECT } from './urls';

export const backend = axios.create({
    baseURL: getConfig().urlHostApi,
    responseType: 'json',
});
export const isTokenNearExpiry = () => {
    const nearExp = 15 * 60 * 1000;
    return (Number(getExpiresAt()) - Date.now()) <= nearExp;
  };
  export const refreshJwt = () => new Promise((resolve) => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      axios.post(
        `${getConfig().urlHostApi}${AUTH.TOKEN_REFRESH}`,
        { refreshToken },
      )
        .then((res) => {
          const t: TokenResponse = res?.data?.content;
          setJWT(t?.access_token);
          setRefreshToken(t?.refresh_token);
          setExpiresInSeconds(t?.expires_in);
          resolve(true);
        })
        .catch(
          (e) => {
            if (e?.response?.data) {
              clearTokens();
              clearLocalUser();
              window.location.href = paths.AUTH;
            }
            resolve(false);
          },
        );
    } else {
      resolve(false);
    }
  });
  export type AuthUrlType = keyof typeof AUTH;
  const refreshInterceptor = (config: AxiosRequestConfig) => {
    if (typeof AUTH[config.url as AuthUrlType] === 'undefined') {
      if (isTokenNearExpiry()) {
        refreshJwt();
      }
    }
    return config;
  };
  const forceRefreshInterceptor = (e: AxiosError) => {
    if ((
      e?.config.url.includes(USER.DETAILS) ||
      e?.config?.url?.includes(PROJECT.LIST_NODE_TYPES) ||
      e?.config?.url?.includes(PROJECT.LIST_STATUS_TYPES)
      ) && e?.response?.status === 401) {
        refreshJwt();
      }
  }
  
backend.interceptors.request.use((config: AxiosRequestConfig) => ({
    ...config,
    headers: {
      Authorization: `Bearer ${getJWT()}`,
      Organisation: getLocalOrganisation()?.id,
      ...(config.headers || {}),
    },
}));
backend.interceptors.request.use(refreshInterceptor);
backend.interceptors.response.use((res) => res, forceRefreshInterceptor);

const apiClient = () => backend;

const sendRequest = async (route: string, data?: object | undefined, params?: object | undefined, method?: Method) => {
    const token = localStorage.getItem('access_token');
    const client = apiClient();
    try {
        const req = await client({
            url: route,
            method: method ?? 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
            },
            data: { ...(data ?? {}) },
            params: { ...(params ?? {}) },
        });
        return req.data;
    } catch (apiErr: AxiosError | unknown) {
        console.error('API ERROR', {
            route,
            data,
            params,
            method,
            apiErr,
        });
        let errorResponse: BasicApiResponse<unknown> = {
            code: 'error',
            warnings: [],
            errors: [{ code: 'G0001', message: 'an unexpected error occurred', detail: `${apiErr}` }],
            content: null,
        };
        if (!axios.isAxiosError(apiErr)) {
            return errorResponse;
        }
        if (apiErr.response) {
            if (apiErr.response.data) {
                errorResponse = apiErr.response.data;
            }
        }
        return errorResponse;
    }
};

export default sendRequest;