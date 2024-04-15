import { Container, Sprite } from "pixi.js";
import { sound } from "@pixi/sound";
import gsap from "gsap";
import { Message } from "./Message";
import { GlowFilter } from "pixi-filters";
import { rand, randInt, randPick } from "../tools";

export class ItemCloseupScene extends Container {

  constructor(gameScene) {
    super();
    this.gameScene = gameScene;
    this.itemsPicked = 0;
    this.lampsRubbed = 0;
    this.eventMode = 'static';
  }

  reset(newGame) {
    this.removeChildren();
    this.item = null;
    this.desc = null;
    this.removeAllListeners();
    if (newGame) {
      this.itemsPicked = 0;
      this.lampsRubbed = 0;
    }
  }

  picked(item) {
    this.itemsPicked += 1;
    this.item = this.addChild(item);
    const desc = this.desc = this.addChild(this.createDescription(item));

    item.picked();

    gsap.timeline({ onComplete: () => this.onItemDetailShown() }).add([
      gsap.to(this.gameScene.bkgBlur, { blur: 8 }),
      gsap.to(item.position, { x: 0, ease: 'power1.in' }),
      gsap.to(item.position, { y: -100, ease: 'power1.out' }),
      gsap.to(item.scale, { x: 2, y: 2, ease: 'power1.in' }),
      gsap.to(desc.scale, { x: 1, ease: 'back.out(0.5)' })
    ]).duration(0.4);
  }

  onItemDetailShown() {
    if (this.item.allowRubbing) {
      this.lampsRubbed += 1;
      this.item.allowRubbing(() => this.onFoundGenie(), () => this.onLampBroken());
    } else {
      this.on('pointerdown', () => this.throwOut());
    }
  }

  onFoundGenie() {
    this.desc.text = `You've summoned the Genie!\n\nafter going through\n${this.itemsPicked} items and ${this.lampsRubbed} rubbings`;
    this.genie = this.addChildAt(new Genie(this.item.sprite.tint), 1)
    this.genie.y = -50;
    this.on('pointerdown', () => {
      this.removeAllListeners();

      gsap.timeline({ onComplete: () => { this.gameScene.newGame(); } }).add([
        gsap.to(this.gameScene.bkgBlur, { blur: 0 }),
        gsap.to(this.item, { alpha: 0}),
        gsap.to(this.genie, {alpha: 0}),
        gsap.to(this.desc.scale, { x: 0, ease: "back.in" })
      ]);
    })
  }

  onLampBroken() {
    this.desc.text = "Darn, its broken!\nNo Genie in this one...";
    this.on('pointerdown', () => this.throwOut());
  }

  throwOut() {
    this.removeAllListeners();

    sound.play(`audio/throw${randInt(4)}.mp3`);
    const throwSide = randPick(-1, 1);
    gsap.timeline({ onComplete: () => { 
      this.reset(); 
      this.gameScene.onItemDismissed();
      sound.play(`audio/drop${randInt(4)}.mp3`);
    } }).add([
      gsap.to(this.gameScene.bkgBlur, { blur: 0 }),
      gsap.to(this.item, { alpha: 0, rotation: throwSide * rand(2, 5) }),
      gsap.to(this.item, { x: throwSide * 1000, ease: "power1.in" }),
      gsap.to(this.item, { y: randInt(-400, -300), ease: "power1.out" }),
      gsap.to(this.desc.scale, { x: 0, ease: "back.in" })
    ]);
  }

  createDescription(item) {
    const desc = new Message({ text: item.desc, size: "wide" });
    desc.y = 150;
    desc.scale.x = 0;
    return desc;
  }
}


class Genie extends Container {
  constructor(tint) {
    super();

    this.genie = this.addChild(Sprite.from('genie'));

    this.gf = new GlowFilter({color: tint, alpha: 0.2});
    this.filters = [this.gf];

    gsap.to(this.genie, {y: -10, ease: 'sine.inOut', repeat: -1, yoyo: true, duration: 3});
    gsap.to(this.gf, {alpha: 0.6, duration: 1, repeat: -1, yoyo: true});
  }

  destroy() {
    gsap.killTweensOf(this.gf);
    gsap.killTweensOf(this.genie);
    super.destroy();
  }
}