import './hello.js'
import './style.css'

import preloader from './preloader.js';
import { initDebug, isDebugOn } from './debug';
import { GameScene } from './game/GameScene';
import { initApp } from './app.js';

if (!isDebugOn) {
  preloader.show();
}

(async () => {
  const app = await initApp();

  if (isDebugOn) {
    initDebug(app);
  }

  await preloader.loadAssets();

  const gameScene = new GameScene();
  console.log('add game scene')
  app.stage.addChild(gameScene);

  const onResize = (width, height) => {
    gameScene.resize(width, height);
  }
  app.renderer.on('resize', onResize);
  onResize(app.screen.width, app.screen.height);

})();
