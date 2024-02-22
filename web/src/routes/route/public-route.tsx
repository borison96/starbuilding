import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import AuthRegistration from "../../pages/auth-registration/auth-registration";

type PublicRouteProps = {
    component: any
}

const PublicRoute = ({component: RouteComponent}: PublicRouteProps) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isLogged = () => {
        const token = localStorage.getItem('access_token')

        if (token) {
            navigate("/")
            return <RouteComponent/>
        } else {
            return <AuthRegistration/>
        }
    }

    return isLogged()

}
export default PublicRoute