import { createWrapper } from 'next-redux-wrapper'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import rootReducer /* { RootState } */ from './reducers'

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    // reducer: (state, action) => {
    // 	if (action.type === HYDRATE) {
    // 		return { ...state, ...action.payload };
    // 	}
    // 	else
    // 		return rootReducer(state, action);
    // },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
const wrapper = createWrapper(makeStore, { debug: true })

type Store = ReturnType<typeof makeStore>

export type AppDispatch = Store['dispatch']
export type RootState = ReturnType<Store['getState']>
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default wrapper
