import THREE from 'three';
declare class AMFLoader {
    constructor(manager: any);
    load: (url: any, onLoad: any, onProgress: any, onError: any) => void;
    parse: (data: any) => THREE.Group;
}
export default AMFLoader;
