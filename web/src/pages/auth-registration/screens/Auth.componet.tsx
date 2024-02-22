import { useMemo } from "react";
import { useParams } from "react-router-dom";
import screens from ".";
type ScreenType = keyof typeof screens;
const AuthComponent = () => {
    const params = useParams();
    const { screen } = params;
    const Screen = useMemo(() => screens[screen as ScreenType] ?? screens.login, [screen]);
    return <Screen />;
};

export default AuthComponent;
