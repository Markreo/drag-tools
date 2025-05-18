import {create} from 'zustand'


type InteractState = {
    objectIdAdding: string | undefined,
    selectObjectIdToAdding: (id: string | undefined) => void,
}

export const useInteractStore = create<InteractState>((set) => ({
    objectIdAdding: undefined,
    selectObjectIdToAdding: (id: string | undefined) => set({objectIdAdding: id}),
}))
