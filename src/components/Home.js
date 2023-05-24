import Component from "../core/Component.js";
export default class Home extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
    <div>home</div>
      <ul>
        ${filteredItems.map(({ id, type, value, datetime }) => `
          <li class="listClick" id=${id}>${type===0? value: '<img src="'+value+'">'}</li>
        `).join('')}
      </ul>
    `
  }
  setEvent() {
    const { deleteItem } = this.$props;
    
    this.addEvent('click', '.listClick', ({ target }) => {
      let target_id = 0
      switch(target.tagName){
        case "LI":
          target_id = target.id
          
          break;
        case "IMG":
          target_id = target.parentElement.id
          break;
      }
      deleteItem(Number(target_id))
      window.api.send("remove-clipboard", Number(target_id));
    })

    //     this.addEvent('click', '.listClick', ({ target }) => {
    //   switch(target.tagName){
    //     case "LI":
    //       window.api.send("save-clipboard", {type:0, data:target.innerHTML});
    //       break;
    //     case "IMG":
    //       window.api.send("save-clipboard", {type:1, data:target.src});          
    //       break
    //   }
    // })
  }
}

