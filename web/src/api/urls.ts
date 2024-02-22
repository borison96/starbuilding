export const ORG = {
    CREATE: '/organisation',
    $JOIN: (id: number | string) => `/public/organisation/${id}/join`,
    LIST_CREATED: '/organisation/created',
    LIST_JOINED: '/organisation/joined',
    IS_MEMBER: '/organisation/member/verify',
    $ACCEPT_JOIN: (id: number | string) => `/organisation/${id}/join/accept`,
    $REJECT_JOIN: (id: number | string) => `/organisation/${id}/join/reject`,
}
export const AUTH = {
    SIGN_IN: '/public/auth/sign-in',
    TOKEN_REFRESH: '/public/auth/token/refresh',
};
export const USER = {
    DETAILS: '/users/details'
};
export const PROJECT = {
    $UPDATE_NODE: (id: number | string) => `/project/${id}/tree/node/update`,
    $UPDATE_PROJECT: (id: number | string) => `/project/${id}/update`,
    BULK_LOAD: '/project/tree',
    $ADD_SECTION: (projectId: number | string, nodeId: number | string) => `/project/${projectId}/tree/node/${nodeId}/section`,
    $ADD_CHILDREN_TO_SECTION: (
        projectId: number | string, nodeId: number | string, sectionId:  number | string
    ) => `/project/${projectId}/tree/node/${nodeId}/section/${sectionId}/children`,
    $REMOVE_CHILDREN_FROM_SECTION: (
        projectId: number | string, nodeId: number | string, sectionId:  number | string
    ) => `/project/${projectId}/tree/node/${nodeId}/section/${sectionId}/children/remove`,
    $MOVE_CHILDREN_BETWEEN_SECTIONS: (
        projectId: number | string, nodeId: number | string,
        sourceId:  number | string, targetId: number | string
    ) => `/project/${projectId}/tree/node/${nodeId}/sections/${sourceId}/${targetId}`,
    $LIST_PROJECT_FILES: (id: number) => `/project/${id}/files`,
    $LIST_PROJECT_NODE_FILES: (id: number, prefix: string) => `/project/${id}/tree/node/files?prefix=${prefix}`,
    $ADD_DOCUMENT_NODE: (projectId: number) => `/project/${projectId}/tree/node/document`,
    $ADD_FILE_TO_NODE: (projectId: number, nodeId: string) => `·${projectId}/tree/node/${nodeId}/document`,
    $SIGN_FILE_KEY: (projectId: number, key: string) => `/project/${projectId}/tree/node/files/signed?key=${key}`,
    LIST_NODE_TYPES: '/project/node/types',
    LIST_STATUS_TYPES: '/project/node/statuses',
};
