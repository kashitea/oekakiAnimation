class Timeline {

  is_li_dragging = false;
  target;

  ul;

  is_play = false;


  constructor() {
    this.ul = document.querySelector('ul');

    //drag
    this.ul.addEventListener('dragstart', this.drag_start.bind(this));
    this.ul.addEventListener('dragend', this.drag_end.bind(this));

    this.ul.addEventListener('dragenter', this.dragenter.bind(this));
    this.ul.addEventListener('dragleave', this.dragleave.bind(this));
    this.ul.addEventListener('dragover', this.dragover.bind(this));
    this.ul.addEventListener('drop', this.drop.bind(this));

    //buttons
    const playbutton = document.querySelector('.play')
    playbutton.addEventListener('click', this.play_stop.bind(this));
    const new_cut_button = document.querySelector('.add-cut');
    new_cut_button.addEventListener('click', this.new_cut.bind(this));
    const delete_cut_button = document.querySelector('.delete-cut');
    delete_cut_button.addEventListener('click', this.delete_cut.bind(this));

    //li-select
    this.ul.addEventListener('click', this.li_select.bind(this));

    //ul.addEventListener('change', this.input_change.bind(this));
  }

  //drag
  drag_start(e) {
    //console.log('dragstart', e);
    if (e.target.matches('li:not(.dummy)')) {
      e.dataTransfer.effectAllowed = 'move'; // 移動のみ許可
      e.target.classList.add('dragging');
      this.is_li_dragging = true;
      }
  }
  drag_end(e) {
    //console.log('dragend', e);
    if (e.target.matches('li:not(.dummy)')) {
      e.target.classList.remove('dragging');
      this.is_li_dragging = false;
    }
  }

  dragenter(e) {
    //console.log('dragenter', e);
    if (this.is_li_dragging && e.target.matches('li')) {
      e.preventDefault();
      e.target.classList.add('drag-over');
    }
  }
  dragleave(e) {
    //console.log('dragleave', e);
    if (this.is_li_dragging && e.target.matches('li')) {
      e.target.classList.remove('drag-over');
    }
  }
  dragover(e) {
    if (this.is_li_dragging && e.target.matches('li')) {
      e.preventDefault();
    }
  }
  drop(e) {
    //console.log('drop', e);
    if (this.is_li_dragging && e.target.matches('li')) {
      // ドラッグ中要素を取得・再配置
      
      const dragging_item = e.target.parentNode.querySelector('.dragging');
      const ref_item = e.target.matches('.dummy') ? e.target.previousSibling : e.target; // ダミーより後ろには置かない
      console.log(dragging_item.classList +' - '+ ref_item.classList)

      const parent = e.target.parentNode;
      const lis = parent.querySelectorAll('li');
      const dragging_item_index = Array.prototype.indexOf.call(lis, dragging_item); 
      const ref_item_index = Array.prototype.indexOf.call(lis, ref_item);

      console.log(dragging_item_index + ' ' + ref_item_index);
      console.log(lis);

      e.target.parentNode.insertBefore(dragging_item, ref_item);
      e.target.classList.remove('drag-over');

      data.update_order(dragging_item_index, ref_item_index === -1 ? lis.length - 1:ref_item_index);

    }
  }




  async play_stop(e) {
    if(this.is_play === false) {
      this.is_play = true;
      e.target.innerHTML = '再生中…';
      e.target.setAttribute('title','ストップ');
      Timer.start();

    }else {
      this.is_play = false;
      e.target.innerHTML = '再生';
      e.target.setAttribute('title','再生');
      Timer.stop();
    }
  }


  cut(freme) {
    const el = document.createElement('li');
    el.setAttribute('draggable', 'true');
    el.innerHTML = '🖌<div>frame<input type="number" step="1" min="1"></div>'
    this.ul.insertBefore(el, document.querySelector('.dummy'));
    const input = el.querySelector('input');
    input.addEventListener('change', (e) => {
      console.log(e.target.value);
      let val = Number(e.target.value);
      val = isNaN(val) ? 1:val;
      val = Math.abs(val === 0 ? 1:val);
      val = Math.floor(val);
      e.target.value = val;

      data.update_frame(this.getlis_count(el) ,val);
    })
    input.value = freme;
    el.click();
  }

  new_cut() {
    data.create_new_cut();
    this.cut(1);
  }

  delete_cut() {
    console.log(this.ul.children.length)
    if(this.ul.children.length > 2) {
      const select = document.querySelector('.select');
      let next_el = select.nextElementSibling;
      if(next_el.matches('.dummy')) {
        next_el = select.previousSibling;
      }
      next_el.click();

      data.delete_cut(this.getlis_count(select));
      select.remove();
    }
  }


  li_select(e) {
    if(e.target.matches('li:not(.dummy)')) {
      if(e.target.matches('.select')){

      }else {
        if(document.querySelector('.select') != null) {
          document.querySelector('.select').classList.remove('select');
        }
        e.target.classList.add('select');

        canvas.setimg(this.getlis_count(e.target));
      }
    }
  }

  getlis_count(el) {
    const lis = this.ul.querySelectorAll('li');
    return Array.prototype.indexOf.call(lis, el);
  }

}

class Timer {
  
  static sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  flag = false;

  static async start() {
    this.flag = true;

    let select = null;
    let frame = null;

    while(true) {
      select = (select !== null) ? this.next(select) : document.querySelector('.select');
      frame = data.getframe(timeline.getlis_count(select));

      select.click();
      
      for(let i=0; i < frame; i++) {
        await this.sleep(41);
        if(this.flag === false) {break;}
      }

      if(this.flag === false) {break;}
    }

  }

  static stop() {
    this.flag = false;
  }

  static next(el) {
    let next_el = el.nextElementSibling;
    if(next_el.matches('.dummy')) {
      next_el = next_el.parentNode.children[0];
    }

    return next_el;
  }

  // static sleep(msec){ 
  //   new Promise(resolve => setTimeout(resolve, msec))
  // }
}



