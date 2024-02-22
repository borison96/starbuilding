import {
    AuthenticationResponse,
    AuthSigninForm,
    ResetPasswordForm,
    User,
    BasicApiResponse,
    CreateUserForm
} from '../../../../typings/api';
import {createAsyncThunk, createSlice, isRejected, isRejectedWithValue} from '@reduxjs/toolkit';
import AuthService from '../../../../api/service/auth-service/auth-service';
import {useNavigate} from "react-router-dom";

export type AuthState = {
    isLoading: boolean;
    isFulfilled: boolean;
    payload: BasicApiResponse<AuthenticationResponse>;
};

const initialState: AuthState = {
    isLoading: false,
    isFulfilled: false,
    payload: { code: "", content: {access_token: "", user: {firstName: "", lastName: "", email: "", phone: 0, phoneFixed: 0, linkedinUrl:"", id:0, createdAt: new Date(), updatedAt:new Date(), version: 0 }}, errors: [], warnings: [] },
};

export const logIn = createAsyncThunk('login', async (loginForm: AuthSigninForm, thunkAPI) => {
    const response = await AuthService.loginUser(loginForm);
    return response;
});

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state = initialState;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logIn.pending, (state) => {
            state.isLoading = true;
            state.isFulfilled = false;
        });
        builder.addCase(logIn.fulfilled, (state, { payload }) => {
            state = { payload, isLoading: false, isFulfilled: true };
            return state;
        });
        builder.addCase(logIn.rejected, (state, errors) => {
            state.isLoading = false;
            state.isFulfilled = false;
            console.log("rejected")
        });
    },
});

export const { resetAuth } = authSlice.actions;

// CREATE USER

export type createUserState = {
    isLoading: boolean;
    isFulfilled: boolean;
    payload: BasicApiResponse<User>;
};

const createUserInitialState: createUserState = {
    isLoading: false,
    isFulfilled: false,
    payload: { code: "", content: {firstName: "", lastName: "", email: "", phone: 0, phoneFixed: 0, linkedinUrl:"", id:0, createdAt: new Date(), updatedAt:new Date(), version: 0 }, errors: [], warnings: [] },
};

export const createUser = createAsyncThunk('create-user', async (form:CreateUserForm, thunkAPI) => {
    const response = await AuthService.createUser(form);
    return response;
});

export const createUserSlice = createSlice({
    name: 'createUserSlice',
    initialState: createUserInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createUser.pending, (state) => {
            state.isLoading = true;
            state.isFulfilled = false;
        });
        builder.addCase(createUser.fulfilled, (state, { payload }) => {
            // @ts-ignore
            state = { payload, isLoading: false, isFulfilled: true };
            return state;
        });
        builder.addCase(createUser.rejected, (state) => {
            state.isLoading = false;
            state.isFulfilled = false;
        });
    },
});

export type ProjectViewState = {
    is_active: boolean;
    name: string;
}

export type PagesState = {
    pages: string;
    selected_tab: string;
    project_view: ProjectViewState;
    map_view: boolean;
};

const initialPagesState: PagesState = {
    pages: "/",
    selected_tab: "Dashboard",
    project_view: {is_active: false, name:""},
    map_view: true,
};

export const pagesSlice = createSlice({
    name: 'page',
    initialState: initialPagesState,
    reducers: {
        PagesChange: (state, {payload}) => {
            state.pages = payload;
        },
        TabChange: (state, {payload}) => {
            state.selected_tab = payload;
        },
        ProjectViewChange: (state, {payload}) => {
            state.project_view = payload;
        },
        MapViewChange:(state, {payload}) => {
            state.map_view = payload;
        }
    }
})

export const { PagesChange, TabChange, ProjectViewChange, MapViewChange } = pagesSlice.actions;

 // Button to change state
export type PhoneInputState = {
    phoneInputPanel: boolean;
    invitationPanel: boolean;
};

const initialPhoneInputState: PhoneInputState = {
    phoneInputPanel: false,
    invitationPanel: false,
};

export const panelSlice = createSlice({
    name: 'phone',
    initialState: initialPhoneInputState,
    reducers: {
        PhoneInputPanel: (state, {payload}) => {
            state.phoneInputPanel = payload;
        },
        InvitationPanel: (state, {payload}) => {
            state.invitationPanel = payload;
        }
    },
});

export const { PhoneInputPanel, InvitationPanel } = panelSlice.actions;