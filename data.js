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

    //セーブ用のオブザーバー
    const observer = new MutationObserver(this.save.bind(this));
    observer.observe(this.data, { attributes: true, childList: true, subtree: true});
  }

  async new_file() {
    try {
      this.handle = await window.showSaveFilePicker(this.options);
    }catch(e) {
      console.log(e)
      return;
    }

    //file initialize
    timeline = new Timeline;
    canvas = new Canvas;
    timeline.new_cut();


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

    timeline = new Timeline;
    canvas = new Canvas;

    console.log(this.data.children)

    for(const i in this.data.children ) {
      if(i === 'length') {break;}
      timeline.cut(this.data.children[i].getAttribute('frame'));
    }
    

    this.close_files_dialog();
  }

  close_files_dialog() {
    console.log('close_files_dialog');
    document.querySelector('.files_dialog').style.display = 'none'
  }

  async save() {
    if(!this.handle) {console.log('return:' + this.handle); return;}
    console.log('ファイルに保存');
    //dataDOMの内容をfileに保存する,更新する

    const writable = await this.handle.createWritable();
    await writable.write(this.data.innerHTML);
    await writable.close();
  }



  update_img(i, data) {
    //dataDOMにある画像データを変更([何個目, データ])
    const el = this.data.children[i];
    el.setAttribute('src', data);
  }

  update_frame(i, frame) {
    //dataDOMにあるフレーム値を変更([何個目, フレーム値])
    const el = this.data.children[i];
    console.log(el);
    el.setAttribute('frame', frame);
  }

  update_order(i, j) {
    //dataDOMにある順番を変更([何個目, 何個目の前])
    const el1 = this.data.children[i];
    const el2 = this.data.children[j];

    this.data.insertBefore(el1, el2);
  }

  getimg(i) {
    //dataDOMからbase64を返す(何個目)
    const el = this.data.children[i];
    const src = el.getAttribute('src');
    return src;
  }

  getframe(i) {
    //dataDOMからframe値を返す(何個目)
    const el = this.data.children[i];
    const frame = el.getAttribute('frame');
    return frame;
  }

  create_new_cut() {
    //dataDOMに新しいデータを追加(何個目の後ろ?)
    const newimg = document.createElement('img');
    newimg.setAttribute('frame','1');
    newimg.setAttribute('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII=');
    this.data.appendChild(newimg);

    return this.data.children.length;
  }

  delete_cut(i) {
    const el = this.data.children[i];
    el.remove();
  }

}
