import sendRequest, { backend } from "../../api-client";

const GET_TOKEN = "/public/forge/authenticate";
const POST_UPLOAD = "/public/forge/upload";
const GET_STATUS = (urn:String) => "/public/forge/upload/status/"+urn;
const CHECK_IFC = (nodeId:String) => "/public/forge/check/"+nodeId;
const GET_IFC_DATA = (nodeId:String) => "/public/forge/metadata/"+nodeId;

const ForgeService = {
    getToken: async () => {
        const response = await sendRequest(GET_TOKEN, undefined, undefined, 'POST')
        return response;
    },
    uploadIFC: async (file: any) => {
        const response = await sendRequest(POST_UPLOAD, file,  undefined, 'POST')
        return response;
    },
    getCheckStatus: async (urn: String) => {
        const response = await backend.get(GET_STATUS(urn));
        return response?.data;
    },
    checkNodeData: async (nodeId: String) => {
        const response = await backend.get(CHECK_IFC(nodeId))
        return response?.data;
    },
    getNodeData: async (nodeId: String) => {
        const response = await backend.get(GET_IFC_DATA(nodeId))
        return response?.data;
    }
}

export default ForgeService;