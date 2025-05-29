import { type Object3D, Quaternion, Vector3} from "three";

export function applyMatrixToObject(object: Object3D) {
    const matrix = object.matrix.clone();
    const pos = new Vector3();
    const quat = new Quaternion();
    const scale = new Vector3();
    matrix.decompose(pos, quat, scale);
    object.position.copy(pos);
    object.quaternion.copy(quat);
    object.scale.copy(scale);
    object.updateMatrix();
}
