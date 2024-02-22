import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from '../../../../api/service/user-service/user-service';
import AuthService from '../../../../api/service/auth-service/auth-service';
import { User } from '../../../../domain/domain';
import { getLocalUser, setExpiresInSeconds, setJWT, setLocalUser, setRefreshToken } from '../../../../storage/local.storage';
import { AuthSigninForm, CreateUserForm } from '../../../../typings/api';
import { startLoading, stopLoading } from '../loader/loader.slice';
import { isTokenNearExpiry, refreshJwt } from '../../../../api/api-client';

export const getUser = createAsyncThunk('user/info', UserService.getUserDetails);

const postInfoActions = async (
  userInfo: any,
  dispatch: any,
  cb?: (user: User) => void,
  errorCb?: (error: any) => void,
) => {
  if (!userInfo || !userInfo.content) {
    if (typeof errorCb === 'function') errorCb(userInfo);
    dispatch(stopLoading());
    return null;
  }
  // save the user in local storage
  setLocalUser(userInfo.content);
  // add the user to the store
  dispatch(stopLoading());
  if (typeof cb === 'function') {
    cb(userInfo.content);
  }
  return userInfo.content;
};

const postLoginActions = async (
  tokenResponse: any,
  dispatch: any,
  cb?: (userInfo: User) => void,
  errorCb?: (error: any) => void,
) => {
  if (!tokenResponse || !tokenResponse.access_token) {
    if (typeof errorCb === 'function') errorCb(tokenResponse);
    dispatch(stopLoading());
    return null;
  }
  // save the token in local storage
  setJWT(tokenResponse?.access_token);
  setRefreshToken(tokenResponse?.refresh_token);
  setExpiresInSeconds(tokenResponse?.expires_in);
  // get the user details from backend
  const userInfo = await UserService.getUserDetails();
  return postInfoActions(userInfo?.data, dispatch, cb, errorCb);
};

export const loginUserAction = createAsyncThunk('user/login', async (config: [
  data: AuthSigninForm, cb?: (userInfo: User) => void, errorCb?: (error: any) => void,
], thunk) => {
  const { dispatch } = thunk;
  const [data, cb, errorCb] = config;
  // dispatch app loader
  dispatch(startLoading({ text: 'logging-you-in' }));
  const tokenResponse = await AuthService.loginUser(data);
  return postLoginActions(tokenResponse?.content, dispatch, cb, errorCb);
});

export const registerUserAction = createAsyncThunk('user/register', async (config: [
  data: CreateUserForm, cb?: (userInfo: User) => void, errorCb?: (error: any) => void,
], thunk) => {
  const { dispatch } = thunk;
  const [data, cb, errorCb] = config;
  // dispatch app loader
  dispatch(startLoading({ text: 'signing-you-up' }));
  const userResponse = await AuthService.createUser(data);
  dispatch(stopLoading());
  return userResponse?.content;
});

export const loadUserAction = createAsyncThunk('user/load', async (config, thunk) => {
  // check if token has expired
  if (isTokenNearExpiry()) {
    await refreshJwt();
  }
  const userInfo = await UserService.getUserDetails();
  return postInfoActions(userInfo.data?.content, thunk.dispatch);
});

const initialState: User = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => null,
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAction.fulfilled, (state, action) => (action.payload ?? state));
    builder.addCase(loginUserAction.fulfilled, (state, action) => (action.payload ?? state));
    builder.addCase(loadUserAction.pending, () => getLocalUser());
    builder.addCase(loadUserAction.fulfilled, (state, action) => (action.payload ?? state));
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
