import { CreateOrganisation } from "../../../domain/domain";
import { backend } from "../../api-client";
import { ORG } from "../../urls";

export const OrganisationService = {
    create: (data: CreateOrganisation) => backend.post(ORG.CREATE, data),
    listCreated: (page: number) => backend.get(`${ORG.LIST_CREATED}?page=${page}&size=25`),
    listJoined: (page: number) => backend.get(`${ORG.LIST_JOINED}?page=${page}&size=25`),
    isMember: (id?: string) => backend.get(ORG.IS_MEMBER, id ? { headers: {
        Organisation: id
    }} : {}),
    acceptJoinRequest: (id: number | string, token: string) => backend.post(ORG.$ACCEPT_JOIN(id), { value: token }),
    rejectJoinRequest: (id: number | string, token: string) => backend.post(ORG.$REJECT_JOIN(id), { value: token }),
};
