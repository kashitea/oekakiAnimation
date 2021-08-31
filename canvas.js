class Canvas {
  canvas;
  ctx;

  now_data;
  now_cut;

  is_drawing = false;
  draw_x;
  draw_y;

  colorpicker;
  thickness_slider;

  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    //size変更のイベントハンドラ+size合わせる
    window.addEventListener('resize', this.size_update.bind(this));
    this.size_update();

    this.canvas.addEventListener('mousedown', this.draw_start.bind(this));
    this.canvas.addEventListener('mouseup', this.draw_end.bind(this));
    this.canvas.addEventListener('mousemove', this.draw_move.bind(this));

    this.colorpicker = document.querySelector('input[type=color]');
    this.thickness_slider = document.querySelector('input[type=range]')
  }

  size_update() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.setimg();
  }

  update_cut(i) {
    this.now_cut = i;
  }
  update_data() {
    this.now_data = this.getimg();
    data.update_img(this.now_cut, this.now_data);
  }

  setimg() {
    //解像度合わせてcanvasに描画
    let img = new Image();
    img.src = this.now_data;

    const ctx = this.ctx;
    const canvas = this.canvas

    img.onload = function(){
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }
  getimg() {
    //base64で現在のキャンバス画像を取得
    return this.canvas.toDataURL('image/png');
  }



  //draw
  draw_start(e) {
    this.is_drawing = true;
    this.draw_x = e.offsetX;
    this.draw_y = e.offsetY;
  }
  draw_end(e) {
    if (this.is_drawing === false) {return}
    this.draw_line(this.draw_x, this.draw_y, e.offsetX, e.offsetY);
    this.is_drawing = false;

    this.update_data();
  }
  draw_move(e) {
    if (this.is_drawing === false) {return}
    this.draw_line(this.draw_x, this.draw_y, e.offsetX, e.offsetY);
    this.draw_x = e.offsetX;
    this.draw_y = e.offsetY;
  }

  draw_line(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.colorpicker.value;
    this.ctx.lineWidth = this.thickness_slider.value;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }



}

