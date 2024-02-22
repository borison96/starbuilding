import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {resetAuth} from "../../services/redux/reducers/auth/auth.slice";
import Layout from "../../pages/layout";

type PrivateRouteProps = {
    restricted?: boolean;
    children: React.ReactNode;
    navbar?: boolean;
};

const PrivateRoute = ({ children, restricted = false, navbar = true }: PrivateRouteProps) => {
    const history = useNavigate();
    const dispatch = useDispatch();
    let expired = false;
    useEffect(() => {
       const checkLogin = () => {
            const token = localStorage.getItem('access_token');
            if (token !== null) {
                const expirationDateToken = JSON.parse(atob(token.split('.')[1]));
                if (expirationDateToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('access_token');
                    expired = true;
                }
            }
            return token !== undefined && token !== null && expired !== true;
        };
        if (!checkLogin() && restricted) {
            dispatch(resetAuth());
            history('/login');
        }
    }, []);

    return (
        <>
            <Layout navbar={navbar}>
            {children}
            </Layout>
        </>
    );
};

export default PrivateRoute;