import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../redux/authSlice.jsx'

const store = configureStore({
    reducer: {
        user: userReducer,
        // Add other reducers here if needed. For example, postReducer, commentReducer, etc.
    },
})

export default store;