import Component from "../core/Component.js";

export default class Clipboard extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
    <div>clipboard</div>
      <ul>
        ${filteredItems.map(({ id, value, datetime }) => `
          <li class="listClick">${value}</li>
        `).join('')}
      </ul>
    `
  }

  setEvent() {
    this.addEvent('click', '.listClick', ({ target }) => {
      window.api.send("click-clipboard", target.innerHTML);
    })
  }
}

