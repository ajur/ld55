import BitArray from "@bitarray/typedarray";
import { app } from "../app";

export class AlphaHitArea {
  static applyTo(spr, threshold = 1) {
    const px = app.renderer.extract.pixels(spr);
    const bal = px.pixels.length / 4;
    const ba = new BitArray(bal);
    for (let i = 0; i < bal; ++i) {
      ba[i] = px.pixels[i * 4 + 3] >= threshold;
    }
    spr.hitArea = new AlphaHitArea(spr, ba, px.width, px.height);
  }

  constructor(spr, bits, width, height) {
    this.bits = bits;
    this.width = width;
    this.height = height;
    this.bounds = spr.getLocalBounds();
  }

  contains(x, y) {
    return this.bounds.containsPoint(x, y) && 
        this.bits[this.width * Math.round(y - this.bounds.minY) + Math.round(x - this.bounds.minX)] === 1;
  }
}
