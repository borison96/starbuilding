import { paths } from "..";
import { clearUser } from "../../services/redux/reducers/user";
import { getJWT } from "../../storage/local.storage";
import { GuardPropType } from "../../typings";

export default function({ dispatch }: GuardPropType) {
    const token = getJWT();
    if (!token) {
        dispatch(clearUser());
        return paths.AUTH + "/login";
    }
    return true;
}
