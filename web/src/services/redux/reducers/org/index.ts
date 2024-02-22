import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenNearExpiry, refreshJwt } from "../../../../api/api-client";
import { OrganisationService } from "../../../../api/service/org-service";
import { CreateOrganisation, Organisation } from "../../../../domain/domain";
import { clearLocalOrg, getLocalOrganisation, setLocalOrganisation } from "../../../../storage/local.storage";

const initialState: Organisation = null;
export const createOrganisationAction = createAsyncThunk('org/create', async (data: CreateOrganisation, thunkAPI) => {
    const response = await OrganisationService.create(data);
    setLocalOrganisation(response?.data?.content);
    return response?.data?.content;
});
export const loadOrgAction = createAsyncThunk('org/load', async () => {
    // check if token has expired
    if (isTokenNearExpiry()) {
      await refreshJwt();
    }
    const orgResponse = await OrganisationService.isMember();
    setLocalOrganisation(orgResponse?.data?.content?.organisation);
    return orgResponse?.data?.content?.organisation;
  });
const orgSlice = createSlice({
    name: 'organisation',
    initialState,
    reducers: {
        setOrganisation: (state, action: PayloadAction<Organisation>) => {
            setLocalOrganisation(action?.payload ?? state);
            return action?.payload ?? state;
        },
        clearOrganisation: () => {
            clearLocalOrg();
            return null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrganisationAction.fulfilled, (state, action) => (action.payload ?? state));
        builder.addCase(loadOrgAction.pending, getLocalOrganisation);
        builder.addCase(loadOrgAction.fulfilled, (state, action) => (action.payload ?? state));
    }
});

export const { setOrganisation, clearOrganisation } = orgSlice.actions;
export default orgSlice.reducer;
