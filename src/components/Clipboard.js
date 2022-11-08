import Component from "../core/Component.js";

export default class Clipboard extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
    <div>clipboard</div>
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
