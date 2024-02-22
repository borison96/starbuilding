import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ForgeService from "../../../../api/service/auth-service/forge-auth-service";
import {sendMail, UserState} from "../email/email.slice";
import {BasicApiResponse, User} from "../../../../typings/api";
import {pagesSlice} from "../auth/auth.slice";

export type ForgeAuthenticateResp = {
    access_token: string,
    token_type: string,
    expires_in: number,
}


export type ForgeResponseState = {
    isLoading: boolean,
    response: BasicApiResponse<ForgeAuthenticateResp | null>;
}

const initialState: ForgeResponseState = {
    isLoading: false,
    response: {code: "", content: null, errors: [], warnings: []},
};


export const getForgeToken = createAsyncThunk('get/forgeToken', async () => {
    const response = await ForgeService.getToken();
    return response;
})

export const getForgeTokenSlice = createSlice({
    name: 'getForgeTokenSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getForgeToken.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getForgeToken.fulfilled, (state, {payload}) => {
            state = {response: payload, isLoading: false};
            return state;
        });
        builder.addCase(getForgeToken.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const getCheckStatus = createAsyncThunk('get/checkStatus', async (urn: String) => {
    const response = await ForgeService.getCheckStatus(urn);
    return response;
})

export type URNLoadState = {
    status: string;
};

export type URNResState = {
    isLoading: boolean,
    response: BasicApiResponse<URNLoadState | null>;
}

const initialURNLoadState: URNResState = {
    isLoading: false,
    response: {code: "", content: null, errors: [], warnings: []},
};

export const getCheckStatusSlice = createSlice({
    name: 'getCheckStatusSlice',
    initialState: initialURNLoadState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCheckStatus.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCheckStatus.fulfilled, (state, {payload}) => {
            state = {response: payload, isLoading: false};
            return state;
        });
        builder.addCase(getCheckStatus.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const checkNodeData = createAsyncThunk('get/checkStatus', async (nodeId : string) => {
    const response = await ForgeService.checkNodeData(nodeId);
    return response;
})

export type NodeState = {
    data: string;
};

export type NodeResState = {
    isLoading: boolean,
    response: BasicApiResponse<NodeState | null>;
}

const initialNodeState: NodeResState = {
    isLoading: false,
    response: {code: "", content: null, errors: [], warnings: []},
};

export const checkNodeSlice = createSlice({
    name: 'checkNodeSlice',
    initialState: initialNodeState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(checkNodeData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(checkNodeData.fulfilled, (state, {payload}) => {
            state = {response: payload, isLoading: false};
            return state;
        });
        builder.addCase(checkNodeData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});


export type URNState = {
    urn: string;
};

const initialURNState: URNState = {
    urn: "",
};

export const postUploadIFCSlice = createSlice({
    name: 'postUploadIFCSlice',
    initialState: initialURNState,
    reducers: {
        setURN: (state, {payload}) => {
            state.urn = payload;
        }
    },
});

export const {setURN} = postUploadIFCSlice.actions;



export const getNodeData = createAsyncThunk('get/nodemetadata', async (nodeId : string) => {
    const response = await ForgeService.getNodeData(nodeId);
    return response;
})

export type getNodeState = {
    data: string;
};

export type getNodeResState = {
    isLoading: boolean,
    response: BasicApiResponse<NodeState | null>;
}

const initialgetNodeState: NodeResState = {
    isLoading: false,
    response: {code: "", content: null, errors: [], warnings: []},
};

export const getNodeSlice = createSlice({
    name: 'getNodeSlice',
    initialState: initialgetNodeState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getNodeData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getNodeData.fulfilled, (state, {payload}) => {
            console.log(payload);
            //state = {response: payload, isLoading: false};
            return state;
        });
        builder.addCase(getNodeData.rejected, (state) => {
            state.isLoading = false;
        });
    },
});