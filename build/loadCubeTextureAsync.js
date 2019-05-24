import CubeTexture from './CubeTexture';
export default async function loadCubeTextureAsync(options) {
    const texture = new CubeTexture();
    await texture.loadAsync(options);
    texture.image[0].isDataTexture = true; // DJM - necessary to upload the images via glTexture2D
    return texture;
}
//# sourceMappingURL=loadCubeTextureAsync.js.map