const LANGUAGE = btoa('strb-k-0001');
const ORG = btoa('strb-k-0002');
const JWT = btoa('strb-k-0003');
const REFRESH_TOKEN = btoa('strb-k-0004');
const EXPIRES_AT = btoa('strb-k-0005');
const EXPIRES_IN_SECONDS = btoa('strb-k-0006');
const USER = btoa('strb-k-0007');
const RELOAD_ON_REFRESH_EXPIRED = btoa('strb-k-0008');
export const REFS = {
  LANGUAGE,
  ORG,
  JWT,
  REFRESH_TOKEN,
  EXPIRES_AT,
  EXPIRES_IN_SECONDS,
  USER,
  RELOAD_ON_REFRESH_EXPIRED,
};

export const setLanguage = (lang: string) => localStorage.setItem(REFS.LANGUAGE, lang);

export const getLanguage = () => localStorage.getItem(REFS.LANGUAGE);

export const setLocalOrganisation = (org: any) => localStorage.setItem(REFS.ORG, JSON.stringify(org));
const getItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch(e: any) {
    return null;
  }
} 
export const getLocalOrganisation = () => getItem(REFS.ORG);

export const setJWT = (jwtStr: string) => {
  localStorage.setItem(REFS.JWT, jwtStr);
};

export const getJWT = () => localStorage.getItem(REFS.JWT);

export const setRefreshToken = (rStr: string) => {
  localStorage.setItem(REFS.REFRESH_TOKEN, rStr);
};

export const getRefreshToken = () => localStorage.getItem(REFS.REFRESH_TOKEN);

export const setExpiresInSeconds = (exp: number) => {
  localStorage.setItem(REFS.EXPIRES_AT, (Date.now() + (exp * 1000)).toString());
  localStorage.setItem(REFS.EXPIRES_IN_SECONDS, exp.toString());
};

export const getExpiresInSeconds = () => localStorage.getItem(REFS.EXPIRES_IN_SECONDS);

export const getExpiresAt = () => localStorage.getItem(REFS.EXPIRES_AT);

export const setLocalUser = (user: any) => {
  localStorage.setItem(REFS.USER, JSON.stringify(user));
};
export const clearLocalUser = () => {
  localStorage.removeItem(REFS.USER);
};
export const clearLocalOrg = () => {
  localStorage.removeItem(REFS.ORG);
}
export const clearTokens = () => {
  localStorage.removeItem(REFS.EXPIRES_IN_SECONDS);
  localStorage.removeItem(REFS.JWT);
  localStorage.removeItem(REFS.REFRESH_TOKEN);
  localStorage.removeItem(REFS.EXPIRES_AT);
};
export const setAutoLoadOnRefreshExpired = () => localStorage.setItem(REFS.RELOAD_ON_REFRESH_EXPIRED, 'true');
export const didAutoLoadOnRefreshExpired = () => localStorage.getItem(REFS.RELOAD_ON_REFRESH_EXPIRED) === 'true';
export const logoutLocal = () => {
  clearTokens();
  clearLocalUser();
  clearLocalOrg();
  localStorage.removeItem(REFS.RELOAD_ON_REFRESH_EXPIRED);
}

export const getLocalUser = () => {
  try {
    const user = localStorage.getItem(REFS.USER);
    return user === null ? null : JSON.parse(user);
  } catch (e) {
    if (window.DEBUG_APP) {
      console.error(e);
    }
    return null;
  }
};