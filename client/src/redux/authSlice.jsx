import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for user registration
export const registerUser = createAsyncThunk(
    'registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const port = "http://localhost:8000";
            const url = `${port}/api/user/register`;
            const response = await axios.post(url, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);



// Thunk for user login
export const loginUser = createAsyncThunk('userlogin', async (data, { rejectWithValue }) => {
    try {
        const port = "http://localhost:8000";
        const url = `${port}/api/user/login`;
        const response = await axios.post(url, data);
        const token = response.data.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data ? error.response.data.message : error.message)
    }
})

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        error: null,
        user: null,
        token: localStorage.getItem('token') || null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

// Exporting the reducer
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
