import {AuthSigninForm, CreateUserForm } from '../../../typings/api';
import sendRequest from '../../api-client';
const LOGIN = '/public/auth/sign-in';
const CREATE_PASSWORD = '/public/users/register';
const FORGOT_PASSWORD = '/auth/public/forgot-password';

const AuthService = {
    loginUser: async (form: AuthSigninForm) => sendRequest(LOGIN, form, undefined, 'POST'),
    createUser: async (form: CreateUserForm) => sendRequest(CREATE_PASSWORD, form, undefined, 'POST'),
};

export default AuthService;
