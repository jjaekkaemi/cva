import Component from "../core/Component.js";

export default class Header extends Component {

  template() {
    const {nowComponent} = this.$props;
    return `<div class="titlebar">titlebar</div>
    <button class="hide">x</button>
    <button class="setting" style="display: ${nowComponent===0 ? 'block' : 'none'}">setting</button>
    <button class="home" style="display: ${nowComponent===1 ? 'block' : 'none'}">home</button>`;
    
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
      changeComponent(1)
    })
    this.addEvent('click', '.home', ({ target }) => {
      changeComponent(0)
    })
  }
}

