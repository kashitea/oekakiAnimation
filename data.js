class Data {

  data;

  handle;
  file;
  options = {
    types: [
      {
        description: "Xml File",
        accept: {
          "text/plain": [".xml", ".html"],
        },
      },
    ],
  };


  constructor() {
    this.data = document.querySelector('data');

    const new_file_button = document.querySelector('.new-file');
    new_file_button.addEventListener('click', this.new_file.bind(this));
    const open_file_button = document.querySelector('.open-file');
    open_file_button.addEventListener('click', this.open_file.bind(this));
  }

  async new_file() {
    try {
      [this.handle] = await window.showSaveFilePicker(this.options);
    }catch(e) {
      console.log(e)
      return;
    }

    this.close_files_dialog();
  }

  async open_file() {
    try {
    [this.handle] = await window.showOpenFilePicker(this.options);
    }catch(e) {
      console.log(e)
      return;
    }

    this.file = await this.handle.getFile();
    this.data.innerHTML = await this.file.text();

    this.close_files_dialog();
  }

  close_files_dialog() {
    //display=none
  }

  async save() {
    console.log('ファイルに保存');
    //dataDOMの内容をfileに保存する,更新する

    const writable = await this.handle.createWritable();
    await writable.write(this.data.innerHTML);
    await writable.close();
  }



  update_img(i, data) {
    //dataDOMにある画像データを変更([何個目, データ])
    const el = this.data.children[i];
    el.src = data;
  }

  update_frame(i, frame) {
    //dataDOMにあるフレーム値を変更([何個目, フレーム値])
    const el = this.data.children[i];
    el.frame = frame;
  }

  update_order(i, j) {
    //dataDOMにある順番を変更([何個目, 何個目])
    const ela = this.data.children[i];
    const elb = this.data.children[j];

    this.data.insertBefore();
  }

  getimg(i) {
    //dataDOMからbase64を返す(何個目)
    const el = this.data.children[i];
    src = el.src;
    return src;
  }

  getframe(i) {
    //dataDOMからframe値を返す(何個目)
    const el = this.data.children[i];
    frame = el.frame;
    return frame;
  }

  create_new_cut() {
    //dataDOMに新しいデータを追加(何個目の後ろ?)
    const newimg = document.createElement('img');
    newimg.setAttribute('frame','1');
    this.data.appendChild(newimg);

    return this.data.children.length;
  }

}
