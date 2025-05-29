import {useThree} from "@react-three/fiber";
import {useDataStore, useInteractStore, useSceneStore} from "../stores";
import {useEffect, useMemo, useState} from "react";
import {Box3, Box3Helper, Color, Matrix4, Object3D, Vector3} from "three";
import {HIGHLIGHT_COLOR} from "../utils";
import {Html} from "@react-three/drei";
import type {MouseEvent} from "react";

export const HighLightBox = () => {
    const {scene} = useThree();
    const itemIdsSelected = useInteractStore(state => state.itemIdsSelected);
    const {updateCount, isDragging, needsToUpdate} = useSceneStore();
    const {selectItem} = useInteractStore();
    const {removeItem, addItem, items} = useDataStore();

    const [htmlPosition, setHTMLPosition] = useState<Vector3>();

    const boundingBox = useMemo(() => {
        const meshes = itemIdsSelected
            .map((itemId) => scene.getObjectByName(itemId))
            .filter((obj): obj is Object3D => obj instanceof Object3D);

        if (meshes.length === 0) return null;

        const box = new Box3().setFromObject(meshes[0]);
        for (let i = 1; i < meshes.length; i++) {
            box.expandByObject(meshes[i]);
        }

        return box;
    }, [scene, itemIdsSelected, updateCount]);

    useEffect(() => {
        // todo: refactor to r3f
        if (!boundingBox || itemIdsSelected.length < 2 || isDragging) return;
        const newHelper = new Box3Helper(boundingBox, new Color(HIGHLIGHT_COLOR));
        newHelper.name = 'groupBox'
        scene.add(newHelper);
        return () => {
            scene.remove(newHelper);
        }
    }, [boundingBox, scene, isDragging]);

    useEffect(() => {
        if (boundingBox) {
            setHTMLPosition(oldPosition => {
                return oldPosition ? oldPosition : boundingBox.max
            })
        } else {
            setHTMLPosition(undefined)
        }
    }, [boundingBox]);

    if (!boundingBox) return null;

    const onClickAction = (action: string) => {
        switch (action) {
            case "duplicate": {
                const newIds: string[] = []
                itemIdsSelected.forEach((itemId) => {
                    const object = scene.getObjectByName(itemId)?.children[0];
                    if (object) {
                        const objectId = items.find((item) => item.id === itemId)?.objectId;
                        if (objectId) {
                            const matrix = object.matrix.clone();
                            matrix.multiply(new Matrix4().makeTranslation(new Vector3(boundingBox.max.x - boundingBox.min.x + 1, 0, 0)));
                            newIds.push(addItem(objectId, matrix));
                        }
                    }
                });
                setTimeout(() => {
                    selectItem(newIds, 'replace');
                }, 50)
                break;
            }
            case "rotate-right": {
                const angleRadians = -Math.PI/25;
                const rotationMatrix = new Matrix4().makeRotationY(angleRadians);

                const center = new Vector3();
                boundingBox.getCenter(center);

                itemIdsSelected.forEach((itemId) => {
                    const object = scene.getObjectByName(itemId)?.children[0];
                    if (object) {
                        const worldPosition = new Vector3();
                        object.getWorldPosition(worldPosition);

                        const offset = new Vector3().subVectors(worldPosition, center);
                        offset.applyMatrix4(rotationMatrix);

                        const newWorldPosition = center.clone().add(offset);

                        object.position.copy(newWorldPosition);

                        object.rotateY(angleRadians);
                        object.updateMatrix()
                    }
                });

                needsToUpdate();
                break;
            }
            case "delete": {
                itemIdsSelected.forEach((itemId) => removeItem(itemId));
                break;
            }
        }
    }

    const stop = (e: MouseEvent) => {
        e.stopPropagation();
    }

    return <Html position={htmlPosition}>
        <div style={{padding: '0.5em'}} onClick={stop}>
            <div style={{
                background: 'white',
                border: '1px solid #f8f8f8',
                padding: '0.5em',
                borderRadius: '5px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <button onClick={() => onClickAction('duplicate')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                             viewBox="0 0 256 256">
                            <path
                                d="M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"></path>
                        </svg>
                    </button>
                    <button onClick={() => onClickAction('rotate-right')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                             viewBox="0 0 256 256">
                            <path
                                d="M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z"></path>
                        </svg>
                    </button>
                </div>
                <div style={{height: '1em', borderRight: '1px solid gray'}}></div>
                {
                    itemIdsSelected.length > 1 && <ActionGroup onClickAction={onClickAction}/>
                }
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <button onClick={() => onClickAction('delete')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                             viewBox="0 0 256 256">
                            <path
                                d="M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </Html>;
}

const ActionGroup = ({onClickAction}: { onClickAction: (event: string) => void }) => {
    return <>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
            <button onClick={() => onClickAction('space-between')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                     viewBox="0 0 256 256">
                    <path
                        d="M233.91,74.79,181.22,22.1a14,14,0,0,0-19.8,0L22.09,161.41a14,14,0,0,0,0,19.8L74.78,233.9a14,14,0,0,0,19.8,0L233.91,94.59A14,14,0,0,0,233.91,74.79ZM225.42,86.1,86.1,225.41h0a2,2,0,0,1-2.83,0L30.58,172.73a2,2,0,0,1,0-2.83L64,136.48l27.76,27.76a6,6,0,1,0,8.48-8.48L72.48,128,96,104.48l27.76,27.76a6,6,0,0,0,8.48-8.48L104.48,96,128,72.49l27.76,27.75a6,6,0,0,0,8.48-8.48L136.49,64,169.9,30.59a2,2,0,0,1,2.83,0l52.69,52.68A2,2,0,0,1,225.42,86.1Z"></path>
                </svg>
            </button>
            <button onClick={() => onClickAction('align-bottom')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                     viewBox="0 0 256 256">
                    <path
                        d="M222,216a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,216Zm-84-40V80a14,14,0,0,1,14-14h40a14,14,0,0,1,14,14v96a14,14,0,0,1-14,14H152A14,14,0,0,1,138,176Zm12,0a2,2,0,0,0,2,2h40a2,2,0,0,0,2-2V80a2,2,0,0,0-2-2H152a2,2,0,0,0-2,2ZM50,176V40A14,14,0,0,1,64,26h40a14,14,0,0,1,14,14V176a14,14,0,0,1-14,14H64A14,14,0,0,1,50,176Zm12,0a2,2,0,0,0,2,2h40a2,2,0,0,0,2-2V40a2,2,0,0,0-2-2H64a2,2,0,0,0-2,2Z"></path>
                </svg>
            </button>
            <button onClick={() => onClickAction('align-top')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000"
                     viewBox="0 0 256 256">
                    <path
                        d="M222,40a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,40ZM206,80v96a14,14,0,0,1-14,14H152a14,14,0,0,1-14-14V80a14,14,0,0,1,14-14h40A14,14,0,0,1,206,80Zm-12,0a2,2,0,0,0-2-2H152a2,2,0,0,0-2,2v96a2,2,0,0,0,2,2h40a2,2,0,0,0,2-2Zm-76,0V216a14,14,0,0,1-14,14H64a14,14,0,0,1-14-14V80A14,14,0,0,1,64,66h40A14,14,0,0,1,118,80Zm-12,0a2,2,0,0,0-2-2H64a2,2,0,0,0-2,2V216a2,2,0,0,0,2,2h40a2,2,0,0,0,2-2Z"></path>
                </svg>
            </button>
        </div>
        <div style={{height: '1em', borderRight: '1px solid gray'}}></div>
    </>
}
