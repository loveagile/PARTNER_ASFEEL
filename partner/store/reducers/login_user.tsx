import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LoginUserState {
  loginUserEmail: string
}

const initialState: LoginUserState = {
  loginUserEmail: '',
}

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    setStoreLoginUserEmail: (state, action: PayloadAction<string>) => {
      state.loginUserEmail = action.payload
    },
  },
})

export const { setStoreLoginUserEmail } = loginUserSlice.actions

export default loginUserSlice.reducer
