import Component from "../core/Component.js";
export default class Home extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
    <div>home</div>
      <ul>
        ${filteredItems.map(({ id, value, datetime }) => `
          <li class="listClick" id=${id}>${value}</li>
        `).join('')}
      </ul>
    `
  }
  setEvent() {
    const { deleteItem } = this.$props;
    
    this.addEvent('click', '.listClick', ({ target }) => {
      deleteItem(Number(target.id))
      window.api.send("remove-clipboard", Number(target.id));
    })
  }
}

