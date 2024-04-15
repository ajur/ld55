import { Container, Sprite, Assets } from "pixi.js";

import { AlphaHitArea } from "./AlphaHitArea";
import { GlowFilter, GlitchFilter } from "pixi-filters";

import { shuffle } from "../tools"
import gsap from "gsap";

const _frameKeys = {};

export function createRandomItem(type, hasGenie, onClick) {
  if (!_frameKeys[type]) {
    _frameKeys[type] = Assets.get('sprites/sprites.json')._frameKeys.filter(k => k.startsWith(type));
  }
  const keys = _frameKeys[type];
  const idx = Math.floor(Math.random() * keys.length);
  const spr = Sprite.from(keys[idx]);

  spr.tint = Math.floor(Math.random() * 16777215);
  spr.scale.x = Math.random() < 0.5 ? -1 : 1;

  if (type === 'lamp') {
    return new Lamp(spr, getRandomLampDesc() + "\nRub it!", onClick, hasGenie);
  } else {
    return new Item(spr, getRandomItemDesc(), onClick);
  }
}

class Item extends Container {
  constructor(sprite, desc, onClick) {
    super();
    this.sprite = this.addChild(sprite);
    AlphaHitArea.applyTo(this.sprite);
    this.onClick = onClick;
    this.desc = desc;

    this.gf = new GlowFilter({color: 0xFFFFAA, alpha: 1})
    
    this.sprite.eventMode = 'static';
    this.sprite
      .on('pointerover', () => {
        this.filters = [this.gf];
      })
      .on('pointerout', () => {
        this.filters = [];
      })
      .on('pointerdown', () => this.onClick?.(this))
  }

  picked() {
    this.sprite.removeAllListeners();
    return gsap.timeline()
      .to(this.gf, {outerStrength: 10, distance: 40, duration: 0.1})
      .to(this.gf, {outerStrength: 0, distance: 0, alpha: 0, duration: 0.3});
  }
}

class Lamp extends Item {
  constructor(sprite, desc, onClick, hasGenie) {
    super(sprite, desc, onClick);
    this.hasGenie = hasGenie;
    this.durability = 1000 + Math.random() * 1000;
  }

  allowRubbing(onRubbingSucceded, onRubbingFailed) {
    this.sprite.eventMode = 'static';
    
    let isRubbing = false;
    let dist = 0;
    let moves = 0;
    let lastPos = null;

    const onDown = (evt) => {
      isRubbing = true;
      lastPos = evt.getLocalPosition(this);
    };
    const onMove = (evt) => {
      if (isRubbing) {
        const newPos = evt.getLocalPosition(this);
        moves++;
        dist += Math.hypot(newPos.x - lastPos.x, newPos.y - lastPos.y);
        lastPos = newPos;

        const avgSpeed = dist / moves;
        
        this.gf.alpha = Math.min(1, 0.4 * avgSpeed)
        this.gf.outerStrength = 2 + dist * 0.01;

        if (dist * avgSpeed > this.durability) {
          isRubbing = false;
          this.sprite.removeAllListeners();
          this.rubbedWell(onRubbingSucceded, onRubbingFailed);
        }
      }
    };
    const onUp = (evt) => {
      if (isRubbing) {
        isRubbing = false;
        dist = 0;
        moves = 0;
        lastPos = null;
        gsap.to(this.gf, {outerStrength: 2, distance: 10, alpha: 0.4, duration: 0.3})
      }
    }
    const onOut = (evt) => {
      gsap.to(this.gf, {alpha: 0, duration: 0.3})
      if (isRubbing) {
        isRubbing = false;
        dist = 0;
        moves = 0;
        lastPos = null;
      }
    }
    const onOver = (evt) => {
      if (!isRubbing) {
        gsap.to(this.gf, {outerStrength: 2, distance: 10, alpha: 0.4, duration: 0.3})
      }
    }

    this.sprite
      .on('pointerover', onOver)
      .on('pointerdown', onDown)
      .on('pointermove', onMove)
      .on('pointerup', onUp)
      .on('pointerout', onOut)
      .on('pointerupoutside', onOut);
  }

  rubbedWell(onRubbingSucceded, onRubbingFailed) {
    gsap.to(this.gf, {alpha: 0, duration: 0.3})
    if (this.hasGenie) {
      onRubbingSucceded();
    } else {
      const df = new GlitchFilter({offset: 20});
      this.filters = [df];
      onRubbingFailed();
    }
  }
}

const LAMPS_DESCS = [
  "An ancient lamp, its bronze hue kissed by the centuries, awaits a fateful rub.",
  "A crystal decanter, etched with arcane runes, captures whispers of the old world.",
  "A mystic bottle, adorned with silver filigree, holding echoes of wishful sighs.",
  "The ornate flask, veiled in sapphire glimmers, promising secrets of infinite realms.",
  "A gilded urn, embossed with celestial maps, a vessel for star-bound spirits.",
  "The cobalt amphora, surface alive with fired gold patterns, a sanctuary for slumbering djinn.",
  "A beaten copper pot, humble yet proud, brimming with untamed magic.",
  "The iridescent vial, shimmering like desert mirages, home to ancient enchantments.",
  "An obsidian chalice, absorbing light and dark, entwining fate with fortune.",
  "The jadeite jug, cool to the touch, where genie dreams swirl in emerald eddies.",
  "A carnelian capsule, its glow as warm as the setting sun, hiding djinni's fiery essence.",
  "A turquoise tumbler, cracked but not broken, testament to a genie's restless strength.",
  "The alabaster ewer, carved intricately, a silent sentinel of sealed wishes.",
  "A serpentine stein, scales etched with spells, a gateway to whispered legends.",
  "The magenta mazer, bold and brilliant, commanding the presence of otherworldly denizens.",
  "A pewter pitcher, simple in shape, deceptive in its promise of boundless power.",
  "The vermilion vessel, hues dancing like flames, harboring a tempest of genies' will.",
  "An onyx olla, polished to perfection, concealing timeless tales of sorcery and sand.",
  "The lapis lazuli bowl, speckled with pyrite stars, an astral prison for the cosmic djinn.",
  "A peridot phial, lighter than air, suspending the very essence of the wind's whispers.",
]

const ITEMS_DESCS = [
  "A shimmering concoction of woven tales and silk.",
  "Mystical orbs that whisper of ancient nights.",
  "Fragrant blocks of the bazaar's best-kept secret.",
  "Metallic clangs turned artful adornments.",
  "Containers of genie-less wonders.",
  "Tuneful strings serenading desert sands.",
  "Liquid gold in a cup, minus the lamp.",
  "Carpets aspiring for aerial aspirations.",
  "Spoons that never made it to Hogwarts.",
  "Echoes of Aladdin's less successful cousin.",
  "Glassware from Cinderella's forgotten step-sister.",
  "Satchels with Narnian return tickets.",
  "Tapestries mapping out unofficial treasure hunts.",
  "Fashion from Cleopatra's discount line.",
  "Scrolls that missed the Dead Sea memo.",
  "Trinkets with tales taller than Burj Khalifa.",
  "Threads boasting 1001 colors.",
  "Pottery chipped by mythic creatures.",
  "Headgear for unsung sultans.",
  "Lanterns looking for a lightbulb moment.",
  "Leather-bound secrets sans the lock.",
  "Wearable rainbows, desert edition.",
  "Cushions that have seen sultans squirm.",
  "Jars hosting invisible djinn conferences.",
  "Flavors that dance the belly dance.",
  "Bracelets jangling with untold lore.",
  "Cherished shards from a vizier's vase.",
  "Footwear for the one-day sultan trial.",
  "Aromatic bricks from Babylon's lesser-known gardens.",
  "Baubles that almost made it to a pharaoh's tomb.",
  "Coins that missed the wishing well.",
  "Mugs designed for genie coffee breaks.",
  "Teasets for the Mad Hatter's Middle Eastern cousin.",
  "Spices with a kick of dragon fire.",
  "Instruments that didn't audition for Aladdin's orchestra.",
  "Relics from an apprentice sorcerer's starter kit.",
  "Mirrors endorsed by mythical vanity.",
  "Shawls spun from discount unicorn mane.",
  "Headpieces that dream of royal scandals.",
  "Sweetmeats whispering tales of 1001 calories.",
];

const shuffledItemsDescs = [];
function getRandomItemDesc() {
  return getRandomDesc(shuffledItemsDescs, ITEMS_DESCS);
}
const shuffledLampDescs = [];
function getRandomLampDesc() {
  return getRandomDesc(shuffledLampDescs, LAMPS_DESCS);
}

function getRandomDesc(shuffled, all) {
  if (shuffled.length === 0) {
    shuffled.push(...all);
    shuffle(shuffled);
  }
  return shuffled.pop();
}