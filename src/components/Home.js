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
      // deleteItem(Number(target.id))
      // window.api.send("remove-clipboard", Number(target.id));
      console.log(target)
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

