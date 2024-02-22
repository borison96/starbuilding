import {authSlice, createUserSlice, pagesSlice, panelSlice} from './reducers/auth/auth.slice';
import { getCurrentUserSlice } from './reducers/user/user-reducer';
import {sendInvitationSlice} from "./reducers/email/email.slice";
import projects from './reducers/project/projects.slice';
import user from './reducers/user';
import organisation from './reducers/org';
import knowledgeTree from './reducers/project/knowledge-tree.slice';
import projectNodeTypes from './reducers/project/project-node-types.slice';
import {
    checkNodeSlice,
    getCheckStatusSlice,
    getForgeTokenSlice,
    postUploadIFCSlice
} from "./reducers/forge/forge.slice";
import projectNodeStatuses from './reducers/project/project-node-statuses.slice';
import mapMeta from './reducers/map/map.slice';
import representation from './reducers/representation/representation.slice';
import kanbanMeta from './reducers/kanban/kanban.slice';
import treeNode from './reducers/tree-node/treeNode.slice';
import resizer from './reducers/resizer/resizer.slice';
import fullScreen from './reducers/fullscreen/fullscreen.slice';

export default {
    currentUser: getCurrentUserSlice.reducer,
    createUser: createUserSlice.reducer,
    auth: authSlice.reducer,
    panel: panelSlice.reducer,
    pages: pagesSlice.reducer,
    email: sendInvitationSlice.reducer,
    forge: getForgeTokenSlice.reducer,
    nodeData: checkNodeSlice.reducer,
    urn: postUploadIFCSlice.reducer,
    urn_load: getCheckStatusSlice.reducer,
    projects,
    knowledgeTree,
    projectNodeTypes,
    projectNodeStatuses,
    user,
    organisation,
    mapMeta,
    representation,
    kanbanMeta,
    treeNode,
    resizer,
    fullScreen,
};
