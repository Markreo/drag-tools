import {Canvas, type ThreeEvent} from "@react-three/fiber"
import {Gltf, Grid, OrbitControls, OrthographicCamera, PerspectiveCamera} from "@react-three/drei"
import {Suspense} from "react";
import {Matrix4, MOUSE} from "three";
import {useDataStore, useInteractStore, useSceneStore} from "../stores";
import {DraggableItem} from "./DraggableItem.tsx";
import {HighLightBox} from "./HighLightBox.tsx";

const MOUSE_MODE = {
    '2D': {LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN},
    '3D': {LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN},
}

export const Scene = ({className}: { className: string }) => {
    const {viewMode} = useSceneStore();
    const {items, addItem} = useDataStore();
    const {objectIdAdding, selectObjectIdToAdding, clearSelectedItem} = useInteractStore();

    const handleClickFloor = (e: ThreeEvent<MouseEvent>) => {
        if (!objectIdAdding) return;
        addItem(objectIdAdding, new Matrix4().setPosition(e.point));
        selectObjectIdToAdding(undefined);
    }

    return <Canvas flat className={className}
                   onCreated={console.log}
                   onPointerMissed={() => {
                       console.log("onPointerMissed");
                       clearSelectedItem();
                   }}>
        <ambientLight/>
        <Grid infiniteGrid={true} cellColor={"white"} sectionColor={"white"}/>
        <OrbitControls makeDefault mouseButtons={MOUSE_MODE[viewMode]} target={[0, 0, 0]}
                       enableRotate={viewMode === '3D'}/>
        {viewMode === '2D' ? (
            <OrthographicCamera
                makeDefault
                position={[0, 10, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                zoom={50}
            />
        ) : (
            <PerspectiveCamera
                makeDefault
                position={[10, 10, 10]}
                fov={50}
            />
        )}

        <axesHelper args={[50]}/>
        <HighLightBox/>
        <Suspense>
            <Gltf src={'/floor.glb'} position={[0, 0.01, 0]} onPointerUp={handleClickFloor}/>
            <group name="items">
                {items.map(item => <DraggableItem item={item} key={item.id}/>)}
            </group>
        </Suspense>
    </Canvas>
}