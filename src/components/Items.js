import Component from "../core/Component.js";

export default class Items extends Component {

  template() {
    const { filteredItems } = this.$props;
    return `
      <ul>
        ${filteredItems.map(({ id, type, value, datetime }) => `
          <li class="listClick">${type===0? value: 'img'}</li>
          
        `).join('')}
      </ul>
    `
  }

  setEvent() {
    const { deleteItem, toggleItem } = this.$props;
    this.addEvent('click', '.listClick', ({ target }) => {
      console.log(target.innerHTML)
      window.api.send("click-clipboard", target.innerHTML);
    })
    this.addEvent('click', '.deleteBtn', ({ target }) => {
      deleteItem(Number(target.closest('[data-seq]').dataset.seq));
    });

    this.addEvent('click', '.toggleBtn', ({ target }) => {
      toggleItem(Number(target.closest('[data-seq]').dataset.seq));
    });

  }

}

