import {
    BoxGeometry,
    DodecahedronGeometry,
    OctahedronGeometry,
    SphereGeometry,
    TetrahedronGeometry,
    BoxHelper,
    Box3,
    Matrix4,
    Mesh
} from "three";
import {useMemo, useRef, useState} from "react";
import {DragControls, Helper} from "@react-three/drei";
import type {Item} from "../models";
import {BufferGeometry} from "three";
import {useThree} from "@react-three/fiber";
import {useInteractStore, useIsItemSelected} from "../stores";
import {HIGHLIGHT_COLOR} from "../utils";

export const DraggableItem = ({item}: { item: Item }) => {
    const {scene} = useThree();

    const selectItem = useInteractStore(state => state.selectItem);
    const isSelected = useIsItemSelected(item.id);

    const [collided, setCollided] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const matrix = useRef<Matrix4>(item.matrix.clone());
    const meshRef = useRef<Mesh>(null);

    const geometry: BufferGeometry | undefined = useMemo(() => {
        let geo: BufferGeometry;
        switch (item.objectId) {
            case "1":
                geo = new BoxGeometry(1, 1, 1);
                break;
            case "2":
                geo = new DodecahedronGeometry(1, 0);
                break;
            case "3":
                geo = new OctahedronGeometry(1, 0);
                break;
            case "4":
                geo = new SphereGeometry(1, 32, 16);
                break;
            case "5":
                geo = new TetrahedronGeometry(1, 0);
                break;
            default:
                geo = new BoxGeometry(1, 1, 1);
        }
        geo.computeBoundingBox();
        return geo;
    }, [item.objectId]);

    const checkCollision = () => {
        if (!meshRef.current) return;

        const itemsGroup = scene.getObjectByName("items");
        if (!itemsGroup) return;

        const currentBox = new Box3().setFromObject(meshRef.current);

        let isColliding = false;

        for (const child of itemsGroup.children) {
            if (child.name === item.id) continue;
            const otherBox = new Box3().setFromObject(child);
            if (currentBox.intersectsBox(otherBox)) {
                isColliding = true;
                break;
            }
        }

        setCollided(isColliding);
    };

    return (
        <group name={item.id}
               onClick={(e) => selectItem(item.id, e.shiftKey ? 'add' : 'replace')}
               onPointerEnter={() => setIsHovered(true)}
               onPointerLeave={() => setIsHovered(false)}>
            <DragControls
                axisLock="y"
                matrix={matrix.current}
                autoTransform={false}
                onDrag={(localMatrix) => {
                    if (!collided || isSelected) {
                        matrix.current.copy(localMatrix);
                    }
                }}
                onDragEnd={checkCollision}
            >
                {(isHovered || isSelected) && <Helper type={BoxHelper} args={[HIGHLIGHT_COLOR]}/>}
                <mesh ref={meshRef} position={[0, 0.5, 0]} geometry={geometry}>
                    <meshStandardMaterial color={collided ? "red" : "orange"}/>
                </mesh>
            </DragControls>
        </group>
    );
};
