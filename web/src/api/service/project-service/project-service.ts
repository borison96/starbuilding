import { FilesListing, NewNodeDataType, ProjectKnowledgeSection, SignedUrlResponse } from '../../../typings';
import {ProjectDetails} from '../../../typings/api';
import sendRequest from "../../api-client";
import apiClient, { backend } from '../../api-client';
import { PROJECT } from '../../urls';
const CREATE_PROJECT = '/project';
const GET_PROJECTS = '/project';
const knowledgeTree = (id: any) => `/project/${id}/tree`;
const addNode = (id: any) => `/project/${id}/tree/node`;
const GET_ROLE_LIST = '/project/roles'

const ProjectService = {
    createProject: async (form: ProjectDetails) => sendRequest(CREATE_PROJECT, form, undefined, 'POST'),
    getProjects: async () => {
        const response = await sendRequest(`${GET_PROJECTS}?size=100`);
        return response?.content ?? [];
    },
    loadKnowledgeTree: async (id: number | string) => {
        const response = await sendRequest(knowledgeTree(id));
        return response?.content?.tree;
    },
    bulkLoadKnowledgeTree: async (ids: Array<number | string>) => {
        const response = await backend.post(PROJECT.BULK_LOAD, { values: ids });
        return response?.data?.content;
    },
    loadNodeTypes: async (id?: number) => {
        const response = await apiClient(`${PROJECT.LIST_NODE_TYPES}?projectId=${id ?? 0}`);
        return response?.content ?? [];
    },
    loadNodeStatuses: async (id?: number) => {
        const response = await apiClient(`${PROJECT.LIST_STATUS_TYPES}?projectId=${id ?? 0}`);
        return response?.content ?? [];
    },
    addNodeToTree: async (id: number | string, node: NewNodeDataType) => {
        const response = await sendRequest(addNode(id), node, undefined, "POST");
        return response?.content?.tree;
    },
    getRoleList: async () => {
        const response = await sendRequest(GET_ROLE_LIST);
        return response?.content?.content ?? [];
    },
    updateNode: async (id: number | string, node: NewNodeDataType) => {
        const response = await backend.post(PROJECT.$UPDATE_NODE(id), node);
        return response?.data?.content?.tree;
    },
    updateProject: async (id: number | string, node: ProjectDetails) => {
        const response = await backend.post(PROJECT.$UPDATE_PROJECT(id), node);
        return response?.data?.content;
    },
    addNodeSection: async (projectId: number | string, nodeId: number | string, section: Partial<ProjectKnowledgeSection>) => {
        const response = await backend.post(PROJECT.$ADD_SECTION(projectId, nodeId), section);
        return response?.data?.content?.tree;
    },
    addChildrenToNodeSection: async (
        projectId: number | string, nodeId: number | string, sectionId: number | string, chldren: Array<string>
    ) => {
        const response = await backend.post(PROJECT.$ADD_CHILDREN_TO_SECTION(
            projectId, nodeId, sectionId
        ), { values: chldren });
        return response?.data?.content?.tree;
    },
    removeChildrenFromNodeSection: async (
        projectId: number | string, nodeId: number | string, sectionId: number | string, chldren: Array<string>
    ) => {
        const response = await backend.post(PROJECT.$REMOVE_CHILDREN_FROM_SECTION(
            projectId, nodeId, sectionId
        ), { values: chldren });
        return response?.data?.content?.tree;
    },
    moveChildrenBetweenNodeSections: async (
        projectId: number | string, nodeId: number | string,
        sourceId: number | string, targetId: number | string, chldren: Array<string>
    ) => {
        const response = await backend.post(PROJECT.$MOVE_CHILDREN_BETWEEN_SECTIONS(
            projectId, nodeId, sourceId, targetId
        ), { values: chldren });
        return response?.data?.content?.tree;
    },
    listProjectFiles: async (id: number) => {
        const response = await backend.get<{ content: FilesListing }>(PROJECT.$LIST_PROJECT_FILES(id));
        return response?.data?.content;
    },
    listProjectNodeFiles: async (id: number, prefix: string) => {
        const response = await backend.get<{ content: FilesListing }>(PROJECT.$LIST_PROJECT_NODE_FILES(id, prefix));
        return response?.data?.content;
    },
    addDocumentNode: async (id: number, data: FormData) => {
        const response = await backend.post(PROJECT.$ADD_DOCUMENT_NODE(id), data);
        return response?.data?.content?.tree;
    },
    addFileToNode: async (id: number, nodeId: string, data: FormData) => {
        const response = await backend.post(PROJECT.$ADD_FILE_TO_NODE(id, nodeId), data);
        return response?.data?.content?.tree;
    },
    signFileKey: async (id: number, key: string) => {
        const response = await backend.get<{ content: SignedUrlResponse}>(PROJECT.$SIGN_FILE_KEY(id, key));
        return response?.data?.content;
    },
    
};

export default ProjectService;