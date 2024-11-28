import { createSlice } from '@reduxjs/toolkit';

const userFromSession = JSON.parse(sessionStorage.getItem('user')) || {
    id: null,
    fullName: '',
    roles: [],
    permissions: [],
    token: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState: userFromSession,
    reducers: {
        setUser(state, action) {
            sessionStorage.setItem('user', JSON.stringify(action.payload));
            return action.payload;
        },
        clearUser() {
            sessionStorage.removeItem('user');
            return { id: null, fullName: '', roles: [], permissions: [], token: '' };
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
