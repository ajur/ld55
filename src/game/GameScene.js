import { Container, Sprite, BlurFilter } from "pixi.js";
import { shuffle } from "../tools";
import { createRandomItem } from "./Item";
import gsap from "gsap";
import { ItemCloseupScene } from "./ItemCloseupScene";

export class GameScene extends Container {

  constructor() {
    super();

    this.playArea = {width: 600, height: 200};

    this.bkg = this.createBackground();
    this.items = this.addChild(new Container());
    this.bkgBlur = new BlurFilter({strength: 0});

    this.closeup = this.addChild(new ItemCloseupScene(this));
  }

  newGame() {
    this.bkg.filters = [];
    this.items.filters = [];
    this.items.interactiveChildren = true;
    
    this.items.removeChildren();
    this.closeup.reset(true);

    this.createItems({miscs: 60, lamps: 6, genies: 1});
  }

  createBackground() {
    const spr = Sprite.from("background.jpg");
    spr.anchor.set(0.5);
    return this.addChild(spr);
  }

  createItems({miscs, lamps, genies}) {
    const types = Array.from({length: miscs}, () => 'misc')
      .concat(Array.from({length: lamps}, () => 'lamp'))
      .concat(Array.from({length: genies}, () => 'lamp+genie'));
    return shuffle(types).map(t => this.addItem(t));
  }

  addItem(itemType) {
    const [type, hasGenie] = itemType.split('+');
    const item = createRandomItem(type, !!hasGenie, this.onItemPicked.bind(this));
    item.x = (Math.random() - 0.5) * this.playArea.width;
    item.y = (Math.random() - 0.5) * this.playArea.height;

    const fromY = 200 + Math.random() * 100;
    const duration = 0.8 + Math.random() * 0.2;
    gsap.from(item, {y: fromY, ease: 'back.out(2)', duration});

    this.items.addChild(item);
  }

  onItemPicked(item) {
    this.items.interactiveChildren = false;
    this.bkg.filters = [this.bkgBlur];
    this.items.filters = [this.bkgBlur];
    
    this.closeup.picked(item);
  }

  onItemDismissed() {
    this.bkg.filters = [];
    this.items.filters = [];
    this.items.interactiveChildren = true;
  }

  resize(width, height) {
    this.x = Math.round(width / 2);
    this.y = Math.round(height / 2);

    const bkgScale = Math.max(width / this.bkg.texture.width, height / this.bkg.texture.height);
    this.bkg.scale.set(bkgScale);
  }
  
}
