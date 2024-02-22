export const isDevConfig = () => process.env.REACT_APP_ENV === "DEV";

export const isRecConfig = () => process.env.REACT_APP_ENV === "REC";

export const isProdConfig = () => process.env.REACT_APP_ENV === "PROD";

export const getConfig = () => {
    // at the moment it will be safe to use window.location.origin
    // to avoid schemes mismatch since we are bundling web and api together
    const urlHostApi = window.location.origin + '/api/v1';
    const devConfig = {
        environment: "dev",
        urlHostApi: "http://localhost:8080/api/v1", //"http://startbuilding-dev.app-joza-it.fr/api/v1",
        nocoDBUrl: 'https://nocostartbuilding-dev.herokuapp.com',
        nocoDBToken: 'd3u8E9SXIrunv7mAd62mN9MLfg4sCLUeWlx58674',
        nocoDBProject: 'p_oum8bxjep4wnt9'
    };

    const recConfig = {
        environment: "rec",
        urlHostApi: "http://startbuilding-dev.app-joza-it.fr/api/v1",
        nocoDBUrl: 'https://nocostartbuilding-dev.herokuapp.com',
        nocoDBToken: 'd3u8E9SXIrunv7mAd62mN9MLfg4sCLUeWlx58674',
        nocoDBProject: 'p_oum8bxjep4wnt9'
    }

    const prodConfig = {
        environment: "prod",
        urlHostApi: "http://startbuilding-rec.app-joza-it.fr/api/v1",
        nocoDBUrl: 'https://nocostartbuilding-dev.herokuapp.com',
        nocoDBToken: 'd3u8E9SXIrunv7mAd62mN9MLfg4sCLUeWlx58674',
        nocoDBProject: 'p_oum8bxjep4wnt9'
    };

    if (isRecConfig()) {
        return recConfig;
    } else if (isProdConfig()) {
        return prodConfig;
    } else {
        return devConfig;
    }
};

export default getConfig();
