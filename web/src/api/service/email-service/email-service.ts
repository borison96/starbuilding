import sendRequest from '../../api-client';
import {sendInvitationType} from "../../../services/redux/reducers/email/email.slice";

const INVITE_EMAIL = (projectId: number) => `/project/${projectId}/invite/`;
const GET_ROLE_LIST = '/project/role/list'

const EmailService = {
    sendEmail: async (projectId: number, inviteForm: sendInvitationType) => sendRequest(INVITE_EMAIL(projectId), inviteForm, undefined, 'POST'),
    getRoleList: async () => {
        const response = await sendRequest(GET_ROLE_LIST);
        return response?.content?.content ?? [];
    }
};

export default EmailService;