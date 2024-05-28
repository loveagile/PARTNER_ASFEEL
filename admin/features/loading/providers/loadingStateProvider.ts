import { atom, useRecoilState } from 'recoil'

interface LoadingState {
  isLoading: boolean
  message?: string
}

export const loadingState = atom<LoadingState>({
  key: 'loadingState',
  default: {
    isLoading: false,
  },
})

export const useLoadingStateProvider = () => {
  const [, setLoading] = useRecoilState(loadingState)
  const setIsLoading = (isLoading: boolean, message?: string) => {
    if (!isLoading) {
      setLoading({ isLoading, message: undefined })
      return
    }
    setLoading({ isLoading, message })
  }

  return { setIsLoading }
}
