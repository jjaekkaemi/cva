import Component from "../core/Component.js";

export default class Setting extends Component {

  template() {
    return `<div>setting</div>`;
  }

  setEvent() {
    const { changeComponent } = this.$props;
    this.addEvent('click', '.hide', ({ target }) => {
      window.api.send("hide", "hide");
    })
        this.addEvent('click', '.exit', ({ target }) => {
        window.api.send("exit", "exit");
    })
        this.addEvent('click', '.setting', ({ target }) => {
      changeComponent()
    })
  }
}

