import { Container, Text, Sprite } from "pixi.js";


export class Message extends Container {
  constructor({ text, size }) {
    super();

    this.size = size;
    this.bkg = this.addChild(Sprite.from('scroll/' + size));
    this.txt = this.addChild(new Text({ text, style: { 
      fontSize: 22,
      align: "center", 
      wordWrap: true,  
      wordWrapWidth: size === "wide" ? 390 : 350
    }, anchor: 0.5 }));
    this.txt.y = -15;
  }

  set text(t) {
    this.txt.text = t;
  }

  get text() {
    return this.txt.text;
  }
}
