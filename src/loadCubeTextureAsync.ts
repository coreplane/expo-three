import CubeTexture from './CubeTexture';

export default async function loadCubeTextureAsync(options: {
  assetForDirection;
  directions?: string[];
}): Promise<CubeTexture> {
  const texture = new CubeTexture();
  await texture.loadAsync(options);
  texture.image[0].isDataTexture = true; // DJM - necessary to upload the images via glTexture2D
  return texture;
}
