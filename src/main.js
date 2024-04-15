import './hello.js'
import './style.css'

import preloader from './preloader.js';
import msg from './msg';
import { initDebug, isDebugOn } from './debug';
import { GameScene } from './game/GameScene';
import { initApp } from './app.js';
import { popup } from './game/Popup.js';

if (!isDebugOn) {
  preloader.show();
}

(async () => {
  const app = await initApp();

  if (isDebugOn) {
    initDebug(app);
  }

  await preloader.loadAssets();

  const game = new GameScene();
  app.stage.addChild(game);

  const onResize = (width, height) => {
    game.resize(width, height);
    msg.emit('resize', width, height);
  };
  app.renderer.on('resize', onResize);
  onResize(app.screen.width, app.screen.height);

  popup({text: "Summoning the Genie\n\n1. find oil lamp or glass bottle\n2. rub it!\n3. summon the Genie!!!", modal: true, onClick: () => game.newGame()});

})();
