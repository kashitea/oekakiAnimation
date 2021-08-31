let canvas;
let data;
let timeline;

window.addEventListener('load', () => {
  canvas = new Canvas;
  data = new Data;
  timeline = new Timeline;
  data.create_new_cut();
})