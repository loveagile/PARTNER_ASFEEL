import { combineReducers } from '@reduxjs/toolkit'
import loginUserReducer from './login_user'
import profileReducer from './profile'
import globalReducer from './global'

const rootReducer = combineReducers({
  login_user: loginUserReducer,
  profile: profileReducer,
  global: globalReducer,
})

// export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
