import {create} from 'zustand'


type InteractState = {
    objectIdAdding: string | undefined,
    itemIdsSelected: string[]; // list id
    cursor: 'default' | 'pointer' | 'grabbing';

    selectObjectIdToAdding: (id: string | undefined) => void,
    selectItem: (id: string, mode?: 'replace' | 'add') => void;
    clearSelectedItem: (id?: string) => void;
}

export const useInteractStore = create<InteractState>((set, get) => ({
    objectIdAdding: undefined,
    itemIdsSelected: [],
    cursor: 'default',
    selectObjectIdToAdding: (id: string | undefined) => set({objectIdAdding: id}),
    selectItem: (id: string, mode: 'replace' | 'add' = 'replace') => {
        if (mode === 'replace') {
            set({itemIdsSelected: [id]})
        } else {
            const itemIdsSelected = get().itemIdsSelected;
            const existedItem = itemIdsSelected.find(itemId => itemId === id);
            if (existedItem) {
                set({itemIdsSelected: itemIdsSelected.filter(itemId => itemId !== id)});
            } else {
                set({itemIdsSelected: [...itemIdsSelected, id]});
            }
        }
    },
    clearSelectedItem: (id?: string) => {
        if (id) {
            set({itemIdsSelected: get().itemIdsSelected.filter(itemId => itemId !== id)});
        }  else {
            set({itemIdsSelected: []})
        }
    },
}))
