import THREE from './Three';
import MTLLoader from './loaders/MTLLoader';
import AMFLoader from './loaders/AMFLoader';

function getExtension(uri: string): string {
  const lastUriComponent = uri.split('.').pop() as string;
  return lastUriComponent.split('?')[0].split('#')[0];
}

export function loaderClassForUri(uri: string): string {
  const extension = getExtension(uri);
  return loaderClassForExtension(extension);
}

export function loaderClassForExtension(extension: string): any {
  if (typeof extension !== 'string') {
    throw new Error('Supplied extension is not a valid string');
  }
  switch (extension.toLowerCase()) {
    // DJM - removed many loaders due to TypeScript incompatibility
    case 'amf': {
      return AMFLoader;
    }
    case 'assimp': {
      const loaderName = 'AssimpLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/AssimpLoader');
      }
      return THREE[loaderName];
    }
    case 'babylon': {
      const loaderName = 'BabylonLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/BabylonLoader');
      }
      return THREE[loaderName];
    }
    case 'bvh': {
      const loaderName = 'BVHLoader';

      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/BVHLoader');
      }
      return THREE[loaderName];
    }
    case 'pcd': {
      const loaderName = 'PCDLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/PCDLoader');
      }
      return THREE[loaderName];
    }
    case 'ply': {
      const loaderName = 'PLYLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/PLYLoader');
      }
      return THREE[loaderName];
    }
    case 'mtl':
      return MTLLoader;
    case 'vtk':
    case 'vtp': {
      const loaderName = 'VTKLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/VTKLoader');
      }
      return THREE[loaderName];
    }
    case 'x': {
      const loaderName = 'XLoader';
      if (!THREE[loaderName]) {
        require('three/examples/js/loaders/XLoader');
      }
      return THREE[loaderName];
    }
    // case 'drc':
    //   if (!THREE.DRACOLoader) require('three/examples/js/loaders/draco/DRACOLoader');
    //   return THREE.DRACOLoader;
    default:
      throw new Error('ExpoTHREE.loaderClassForExtension(): Unrecognized file type ' + extension);
  }
}
