class Timeline {

  is_li_dragging = false;
  target;

  constructor() {
    const ul = document.querySelector('ul');

    //drag
    ul.addEventListener('dragstart', this.drag_start.bind(this));
    ul.addEventListener('dragend', this.drag_end.bind(this));

    ul.addEventListener('dragenter', this.dragenter.bind(this));
    ul.addEventListener('dragleave', this.dragleave.bind(this));
    ul.addEventListener('dragover', this.dragover.bind(this));
    ul.addEventListener('drop', this.drop.bind(this));

    
  }

  //drag
  drag_start(e) {
    //console.log("dragstart", e);
    if (e.target.matches("li:not(.dummy)")) {
      e.dataTransfer.effectAllowed = "move"; // 移動のみ許可
      e.target.classList.add("dragging");
      this.is_li_dragging = true;
      }
  }
  drag_end(e) {
    //console.log("dragend", e);
    if (e.target.matches("li:not(.dummy)")) {
      e.target.classList.remove("dragging");
      this.is_li_dragging = false;
    }
  }

  dragenter(e) {
    //console.log("dragenter", e);
    if (this.is_li_dragging && e.target.matches("li")) {
      e.preventDefault();
      e.target.classList.add("drag-over");
    }
  }
  dragleave(e) {
    //console.log("dragleave", e);
    if (this.is_li_dragging && e.target.matches("li")) {
      e.target.classList.remove("drag-over");
    }
  }
  dragover(e) {
    if (this.is_li_dragging && e.target.matches("li")) {
      e.preventDefault();
    }
  }
  drop(e) {
    //console.log("drop", e);
    if (this.is_li_dragging && e.target.matches("li")) {
      // ドラッグ中要素を取得・再配置
      const dragging_item = e.target.parentNode.querySelector(".dragging");
      const ref_item = e.target.matches(".dummy") ? e.target.previousSibling : e.target; // ダミーより後ろには置かない
      //console.log(dragging_item + ref_item)
      e.target.parentNode.insertBefore(dragging_item, ref_item);
      e.target.classList.remove("drag-over");


    }
  }




  //resize
  resize() {
    console.log('resize-li')
  }



}





