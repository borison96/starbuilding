import { paths } from "..";
import { getJWT, getLocalOrganisation } from "../../storage/local.storage";
import { GuardPropType } from "../../typings";

export default function({ location }: GuardPropType) {
    const token = getJWT();
    const organisation = getLocalOrganisation();
    if (token && organisation && !location.search?.includes('step=')) {
        return paths.DASHBOARD;
    }
    return true;
}
