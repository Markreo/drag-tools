import {useInteractStore} from "./interactStore.ts";

export const useIsItemSelected = (id: string) => {
    const itemIdsSelected = useInteractStore(state => state.itemIdsSelected);
    return itemIdsSelected.includes(id);
}