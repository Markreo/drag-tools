import type {Matrix4} from "three";

export type ViewMode = '2D' | '3D';

export type Item = {
    id: string;
    objectId: string;
    matrix: Matrix4;
}