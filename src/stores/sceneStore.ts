import {create} from 'zustand'
import type {ViewMode} from '../models'


interface SceneState {
    viewMode: ViewMode
    updateCount: number;
    isDragging: boolean;
    setViewMode: (mode: ViewMode) => void
    needsToUpdate: () => void;
    setDragging: (isDragging: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
    viewMode: '2D',
    updateCount: 0,
    isDragging: false,
    setViewMode: (mode) => set({viewMode: mode}),
    needsToUpdate: () => set(({updateCount}) => ({updateCount: updateCount + 1})),
    setDragging: (isDragging: boolean) => set({isDragging: isDragging})
}))
