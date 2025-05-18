import {create} from 'zustand'
import type {ViewMode} from '../models'


interface SceneState {
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
}

export const useSceneStore = create<SceneState>((set) => ({
    viewMode: '2D',
    setViewMode: (mode) => set({viewMode: mode}),
}))
