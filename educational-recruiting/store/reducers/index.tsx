import { combineReducers } from '@reduxjs/toolkit'
import counterReducer from './counter'
import globalReducer from './global'

const rootReducer = combineReducers({
  counter: counterReducer,
  global: globalReducer,
})

// export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer
