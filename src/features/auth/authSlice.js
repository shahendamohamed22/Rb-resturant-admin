import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    adminId: null,
    name: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, adminId, name } = action.payload;
      state.token = token;
      state.adminId = adminId;
      state.name = name;
    },
    logout: (state) => {
      state.token = null;
      state.adminId = null;
      state.name = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;