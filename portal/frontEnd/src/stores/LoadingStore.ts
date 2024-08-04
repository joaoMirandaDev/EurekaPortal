import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  numOfLoaders: number
  startLoading: () => void
  stopLoading: () => void
}

export const useLoadingStore = create<LoadingState>()((set, get) => ({
  isLoading: false,
  numOfLoaders: 0,
  startLoading: () => {
    const { numOfLoaders } = get()
    if (numOfLoaders === 0) {
      set(state => ({ isLoading: true, numOfLoaders: state.numOfLoaders + 1 }))
    } else {
      set(state => ({ numOfLoaders: state.numOfLoaders + 1 }))
    }
  },
  stopLoading: () => {
    const { numOfLoaders } = get()
    if (numOfLoaders === 1) {
      set(state => ({ isLoading: false, numOfLoaders: state.numOfLoaders - 1 }))
    } else {
      set(state => ({ numOfLoaders: state.numOfLoaders - 1 }))
    }
  },
}))
