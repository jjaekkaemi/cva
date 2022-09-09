import Component from "../core/Component.js";

export default class Setting extends Component {

  template() {
    return `<div>setting</div>
    <li class="listClick">Shift+V</li>
    <li class="listClick">Tab+V</li>`;
  }

  setEvent() {
    this.addEvent('click', '.listClick', ({ target }) => {
      window.api.send("change-key", target.innerHTML);
    })
  }
}

