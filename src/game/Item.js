import { Container, Sprite, Assets } from "pixi.js";

import { AlphaHitArea } from "./AlphaHitArea";

const _frameKeys = {};

export function createRandomItem(type) {
  if (!_frameKeys[type]) {
    _frameKeys[type] = Assets.get('sprites/sprites.json')._frameKeys.filter(k => k.startsWith(type));
  }
  const keys = _frameKeys[type];
  const idx = Math.floor(Math.random() * keys.length);
  const spr = Sprite.from(keys[idx]);

  spr.tint = Math.floor(Math.random() * 16777215);

  return new Item(spr);
}

export class Item extends Container {
  constructor(sprite) {
    super();
    this.sprite = this.addChild(sprite);
    this.sprTint = this.sprite.tint;
    this.altTint = 0xffffff - this.sprite.tint;

    AlphaHitArea.applyTo(this.sprite);
    
    this.sprite.eventMode = 'static';
    this.sprite
      .on('pointerover', () => {
        this.sprite.tint = this.altTint;
      })
      .on('pointerout', () => {
        this.sprite.tint = this.sprTint;
      });
  }

  
}
