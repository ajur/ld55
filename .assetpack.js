import { pixiManifest } from "@assetpack/plugin-manifest";
import { pixiTexturePacker } from '@assetpack/plugin-texture-packer';

export default {
  entry: "./raw_assets",
  output: "./public/assets/",
  cache: false,
  plugins: {
    manifest: pixiManifest(),
    texture: pixiTexturePacker({
      texturePacker: {
          removeFileExtension: true,
      },
    }),
  },
};