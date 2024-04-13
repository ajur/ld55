import { pixiManifest } from "@assetpack/plugin-manifest";
import { texturePacker } from '@assetpack/plugin-texture-packer';

export default {
  entry: "./assets/raw",
  output: "./public/assets/",
  cache: false,
  plugins: {
    manifest: pixiManifest(),
    texture: texturePacker({
      texturePacker: {
          removeFileExtension: true,
          exporter: {
            type: "PixiMod",
            description: "modified pixi.js format",
            allowTrim: true,
            allowRotation: true,
            template: "./assets/tpPixiMod.mst",
            fileExt: "json"
          }
      },
    })
  },
};

