import sendRequest from "../../../api/api-client";
import { ORG } from "../../../api/urls";

export const searchOrg = (q: string) => sendRequest(`/public/users/organisations/search?q=${q}`).then(res => res?.content?.content);
export const searchCompetence = (q: string) => sendRequest(`/public/rome/search?q=${q}`).then(res => res?.content?.content);
export const requestToJoin = (id: string | number, email: string) => sendRequest(ORG.$JOIN(id), { value: email }, undefined, 'POST');
