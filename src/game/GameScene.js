import { Container, Rectangle, Sprite } from "pixi.js";
import { shuffle } from "../tools";
import { createRandomItem } from "./Item";

export class GameScene extends Container {

  constructor() {
    super();

    this.bkg = this.createBackground();
    this.items = this.createItems({miscs: 100, lamps: 7});

  }

  resize(width, height) {
    this.x = Math.round(width / 2);
    this.y = Math.round(height / 2);

    const bkgScale = Math.max(width / this.bkg.texture.width, height / this.bkg.texture.height);
    this.bkg.scale.set(bkgScale);
  }

  createBackground() {
    const spr = Sprite.from("background.jpg");
    spr.anchor.set(0.5);
    return this.addChild(spr);
  }

  addItem(type) {
    const item = createRandomItem(type);
    item.x = Math.random() * 600 - 300;
    item.y = Math.random() * 200 - 100;

    return this.addChild(item);
  }

  createItems({miscs, lamps}) {
    const types = Array.from({length: miscs}, () => 'misc').concat(Array.from({length: lamps}, () => 'lamp'));
    return shuffle(types).map(t => this.addItem(t));
  }

}

