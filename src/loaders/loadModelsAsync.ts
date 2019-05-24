import AssetUtils from 'expo-asset-utils';
import { Platform } from 'react-native';
import THREE from '../Three';
import readAsStringAsync from './readAsStringAsync';

var MTLLoader = null;
var OBJLoader = null;
var ColladaLoader = null;

function provideBundlingExtensionErrorMessage({ extension, funcName }) {
  return `
    ExpoTHREE.${funcName}: The \`asset\` provided cannot be resolved. 
    Please make sure your Expo project's \`app.json\` is bundling your asset, by including the extension: ${extension}
      // app.json
      "expo": {
          "packagerOpts": {
              assetExts: [ 
                  "${extension}", 
                  ... 
              ],
          }
      }`;
}

async function loadFileAsync({ asset, extension, funcName }): Promise<string | null> {
  if (!asset) {
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  }
  try {
    return await AssetUtils.uriAsync(asset);
  } catch ({ message }) {
    const customErrorMessage = provideBundlingExtensionErrorMessage({
      extension,
      funcName,
    });
    throw new Error(`${customErrorMessage}, ${message}`);
  }
}

export async function loadTextureAsync({ asset }): Promise<any> {
  if (!asset) {
    throw new Error('ExpoTHREE.loadTextureAsync(): Cannot parse a null asset');
  }

  if (Platform.OS === 'web') {
    const assetUrl = await AssetUtils.uriAsync(asset);
    // DJM - return an actual promise here
    const loader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        loader.load(assetUrl,
		texture => resolve(texture),
                undefined,
                err => reject(err));
        });
  }

  let nextAsset = asset;
  if (!nextAsset.localUri) {
    nextAsset = await AssetUtils.resolveAsync(asset);
  }
  const texture = new THREE.Texture();
  texture.image = {
    data: nextAsset,
    width: nextAsset.width,
    height: nextAsset.height,
  };
  texture.needsUpdate = true;
  texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.minFilter = THREE.LinearFilter; // Pass-through non-power-of-two
  return texture;
}

export async function loadMtlAsync({ asset, onAssetRequested }): Promise<any> {
  let uri = await loadFileAsync({
    asset,
    extension: 'mtl',
    funcName: 'loadMtlAsync',
  });
  if (!uri) return;

  if (MTLLoader == null) {
    MTLLoader = require('./MTLLoader');
  }
  // @ts-ignore
  const loader = new MTLLoader();
  loader.setPath(onAssetRequested);

  return loadFileContentsAsync(loader, uri, 'loadMtlAsync');
}

export async function loadObjAsync(options: {
  asset: any;
  onAssetRequested?: (...args: any[]) => any;
  onMtlAssetRequested?: (...args: any[]) => any;
  mtlAsset?: any;
  materials?: any;
}): Promise<any> {
  const { asset, onAssetRequested, onMtlAssetRequested, mtlAsset, materials } = options;
  let nextMaterials = materials;
  if (nextMaterials == null && mtlAsset != null) {
    nextMaterials = await loadMtlAsync({
      asset: mtlAsset,
      onAssetRequested: onMtlAssetRequested || onAssetRequested,
    });
    nextMaterials.preload();
  }

  let uri = await loadFileAsync({
    asset,
    extension: 'obj',
    funcName: 'loadObjAsync',
  });
  if (!uri) return;

  if (OBJLoader == null) {
    OBJLoader = require('three/examples/js/loaders/OBJLoader');
  }
  // @ts-ignore
  const loader = new OBJLoader();
  loader.setPath(onAssetRequested as any);
  if (nextMaterials != null) {
    loader.setMaterials(nextMaterials);
  }

  return loadFileContentsAsync(loader, uri, 'loadObjAsync');
}

export async function loadDaeAsync({ asset, onAssetRequested, onProgress }): Promise<any> {
  let uri = await loadFileAsync({
    asset,
    extension: 'dae',
    funcName: 'loadDaeAsync',
  });
  if (typeof uri !== 'string' || uri == null) {
    return;
  }

  if (ColladaLoader == null) {
    ColladaLoader = require('three/examples/js/loaders/ColladaLoader');
  }

  return new Promise((res, rej) =>
    new THREE.FileLoader().load(
      uri!,
      text => {
        // @ts-ignore
        const loader = new ColladaLoader();
        const parsedResult = (loader.parse as any)(text, onAssetRequested);
        res(parsedResult);
      },
      onProgress,
      rej
    )
  );
}

async function loadFileContentsAsync(loader, uri, funcName): Promise<any> {
  try {
    const fileContents = await readAsStringAsync(uri);
    return loader.parse(fileContents);
  } catch ({ message }) {
    // Or model loader THREE.OBJLoader failed to parse fileContents
    throw new Error(
      `ExpoTHREE.${funcName}: Expo.FileSystem Failed to read uri: ${uri}. ${message}`
    );
  }
}

export async function loadArrayBufferAsync({ uri, onProgress }): Promise<any> {
  const loader = new THREE.FileLoader();
  loader.setResponseType('arraybuffer');
  return new Promise((res, rej) => loader.load(uri, res, onProgress, rej));
}
