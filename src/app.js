import { Application } from 'pixi.js';

export let app = null;

export async function initApp() {
  app = new Application();
  await app.init({ background: '#000000', resizeTo: window });

  const appElem = document.querySelector('#app') ?? document.body;
  appElem.appendChild(app.canvas);

  console.log('app inited', app)
  return app;
}
