import Component from "../core/Component.js";

export default class Clipboard extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
    <div>clipboard~~</div>
      <button class="pre-clicked">pre</button>
      <button class="next-clicked">next</button>
      <ul>
        ${filteredItems.map(({ id, type, value, datetime }) => `
          <li class="listClick" id=${id}>${type===0? value: '<img src="'+value+'">'}</li>
        `).join('')}
      </ul>
    `
  }
  created(){
    window.api.receive("update-shortcut", (data) => {
    });
  }
  setEvent() {
    // const { deleteItem } = this.$props;
    
    // this.addEvent('click', '.listClick', ({ target }) => {
    //   let target_id = 0
    //   switch(target.tagName){
    //     case "LI":
    //       target_id = target.id
          
    //       break;
    //     case "IMG":
    //       target_id = target.parentElement.id
    //       break;
    //   }
    //   console.log(target_id)
    //   // deleteItem(Number(target_id))
    //   window.api.send("remove-clipboard", Number(target_id));
    // })
    this.addEvent('click', '.pre-clicked', ({ target }) => {
      window.api.send("pre-clicked", "pre-clicked");
    })
    this.addEvent('click', '.next-clicked', ({ target }) => {
      window.api.send("next-clicked", "next-clicked");
    })
    this.addEvent('click', '.listClick', ({ target }) => {
      switch(target.tagName){
        case "LI":
          window.api.send("click-clipboard", {type:0, data:target.innerHTML});
          break;
        case "IMG":
          window.api.send("click-clipboard", {type:1, data:target.src});          
          break
      }
    })
  }
}
