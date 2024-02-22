import { backend } from '../../api-client';
import { CreateUserType } from "../../../services/redux/reducers/update-user/update-user.slice";
import { BasicApiResponse } from '../../../typings/api';
import { USER } from '../../urls';
import sendRequest from "../../api-client";

const GET_ME = '/users/details';
const UPDATE_USER = (userId: number) => `/users/update-user/${userId}`;

const UserService = {
    getMe: async (): Promise<BasicApiResponse<any>> => sendRequest(GET_ME, undefined, undefined, 'GET'),
    getUserDetails: async () => backend.get(USER.DETAILS),
    updateUser: async (userId: number, createUserForm: CreateUserType) => sendRequest(UPDATE_USER(userId), createUserForm, undefined, 'PUT'),
};

export default UserService;