import './hello.js'
import './style.css'

import { Application, Sprite, AnimatedSprite } from 'pixi.js';

import preloader from './preloader.js';
import { initDebug, isDebugOn } from './debug';

if (!isDebugOn) {
  preloader.show();
}

(async () => {
  const app = new Application();
  await app.init({ background: '#47ABA9', resizeTo: window });

  const appElem = document.querySelector('#app') ?? document.body;
  appElem.appendChild(app.canvas);

  const assets = await preloader.loadAssets();

  if (isDebugOn) {
    initDebug(app);
  }
  

  renderScene(app, assets);
  

})();

function renderScene(app, assets) {
  const foamFrameKeys = assets._frameKeys.filter(k => k.startsWith('water/foam')).sort()
  const foam = AnimatedSprite.fromFrames(foamFrameKeys);
  foam.anchor.set(0.5);
  foam.position.set(app.screen.width / 2, app.screen.height / 2)
  app.stage.addChild(foam);
  foam.animationSpeed = 0.1;
  foam.play();

  const ground = Sprite.from("ground/flat/grass/s");
  ground.anchor.set(0.5);
  ground.position.set(app.screen.width / 2, app.screen.height / 2)
  app.stage.addChild(ground);

  const sheepIdleFrameKeys = assets._frameKeys.filter(k => k.startsWith('sheep/idle')).sort()
  const sheep = AnimatedSprite.fromFrames(sheepIdleFrameKeys);
  sheep.anchor.set(0.5);
  sheep.position.set(app.screen.width / 2, app.screen.height / 2)
  app.stage.addChild(sheep);
  sheep.animationSpeed = 0.15;
  sheep.play();
}