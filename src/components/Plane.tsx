import { useLoader } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const Plane = () => {
    const { nodes } = useLoader(GLTFLoader, '/walls.glb');

    const [plan, setPlan] = useState<any>();
    const [cube, setCube] = useState<any>();

    useEffect(() => {
        if (nodes) {
            const c = nodes['cube'];
            setCube(c);
            setPlan(nodes['plane']);
        }
    }, [nodes]);

    if (!cube || !plan) return;
    return (
        <group >
            <primitive object={cube}></primitive>
            <primitive object={plan}></primitive>
        </group>
    );
};
