import { Container, Sprite } from "pixi.js";
import { app } from "../app";
import { Message } from "./Message";
import gsap from "gsap";


export const popup = ({text, size = 'big', modal = false, onClick}) => {
  const p = new Popup({text, size, modal, onClick});
  p.resize(app.screen.width, app.screen.height);
  app.stage.addChild(p);
}

export class Popup extends Container {
  constructor({text, size, modal, onClick}) {
    super();

    this.alpha = 0;
    this.onClickCb = onClick;

    if (modal) {
      this.bkg = this.createBackground();
    }
    this.message = this.addChild(new Message({text, size}));
    
    gsap.to(this, {alpha: 1, duration: 0.3});

    this.eventMode = 'static';
    this.on('pointerdown', this.clicked);
  }

  createBackground() {
    const bkg = Sprite.from("backgroundBlured.jpg");
    bkg.anchor.set(0.5);
    return this.addChild(bkg);
  }

  clicked() {
    gsap.to(this, {alpha: 0, duration: 0.5, ease: 'power1.in', onComplete: () => this.destroy()});
    this.onClickCb?.();
  }

  resize(width, height) {
    this.x = Math.round(width / 2);
    this.y = Math.round(height / 2);

    if (this.bkg) {
      const bkgScale = Math.max(width / this.bkg.texture.width, height / this.bkg.texture.height);
      this.bkg.scale.set(bkgScale);
    }
  }

}

