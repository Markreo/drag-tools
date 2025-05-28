import {create} from 'zustand';
import type {Matrix4} from 'three';
import {nanoid} from 'nanoid';
import type {Item} from '../models';
import {useInteractStore} from "./interactStore";

type DataState = {
    items: Item[];
    setItems: (items: Item[]) => void;
    updateItem: (item: Item) => void;
    addItem: (objectId: string, matrix: Matrix4) => void;
    removeItem: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
    items: [],
    setItems: (items) => set({items}),
    updateItem: (item) =>
        set((state) => ({
            items: state.items.map((i) => (i.id === item.id ? item : i)),
        })),
    addItem: (objectId, matrix) =>
        set((state) => ({
            items: [
                ...state.items,
                {
                    id: nanoid(),
                    objectId,
                    matrix: matrix.clone(), // Ensure immutability
                },
            ],
        })),
    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));
        useInteractStore.getState().clearSelectedItem(id);
    },
}));
