import Component from "./core/Component.js";
import ItemAppender from "./components/ItemAppender.js";
import Header from "./components/Header.js";
import Setting from "./components/Setting.js"
import Home from "./components/Home.js"
import Clipboard from "./components/Clipboard.js"
export default class App extends Component {

  setup() {
    this.$state = {
      change_component: 0,
      items: []
    };
    
    
  }

  template() {
    return `
    <div class="container">
      <header class="title" data-component="header"></header>
      <main class="main" data-component="home" style="display: ${this.nowComponent===0 ? 'block' : 'none'}"></main>
      <main class="main" data-component="clipboard" style="display: ${this.nowComponent===2 ? 'block' : 'none'}"></main>
      <main class="main" data-component="setting" style="display: ${this.nowComponent===1 ? 'block' : 'none'}"></main>
    </div>
      `;
  }
  created(){
    window.api.receive("fromMain", (data) => {
      console.log(`Received [${data}] from main process`);
    });
    window.api.receive("close-clipboard", (data) => {
      console.log(`Received [${data}] from main process`);
    });
    window.api.receive("open-clipboard", (data) => {
      this.changeComponent(2)
      this.addItem(data)
    });
    window.api.receive("receive-data", (data) => {
      this.addItem(data)
    });
    window.api.receive("open-main", (data) => {
      console.log(data)
      this.changeComponent(0)
      this.addItem(data)
    });
  }
  mounted() {

    const { filteredItems, addItem, deleteItem, toggleItem, changeComponent, nowComponent } = this;
    const $header = this.$target.querySelector('[data-component="header"]');
    const $setting = this.$target.querySelector('[data-component="setting"]');
    const $home = this.$target.querySelector('[data-component="home"]');
    const $clipboard = this.$target.querySelector('[data-component="clipboard"]');
    new Home($home, {
      filteredItems,
      deleteItem: deleteItem.bind(this),
      toggleItem: toggleItem.bind(this),
    });
    new Clipboard($clipboard, {
      filteredItems,
    });
    new Setting($setting, {});
    new Header($header, {
      nowComponent,
      changeComponent: changeComponent.bind(this)
    })

  }
  get nowComponent(){
    const {change_component}  = this.$state;
    return change_component
  }
  get filteredItems() {
    const { items } = this.$state;
    return items
  }
  changeComponent(component){
    console.log("change component :",component)
    this.setState({
      change_component: component
    })
    const {change_component}  = this.$state;
    console.log(change_component)
  }
  addItem(contents) {
    const { items } = this.$state;
    const seq = Math.max(0, ...items.map(v => v.seq)) + 1;
    const active = false;
    this.setState({
      items: contents
    });
  }
  deleteItem(id) {
    const items = [...this.$state.items];
    items.splice(items.findIndex(v => v.id === id), 1);
    this.setState({ items });
  }

  toggleItem(seq) {
    const items = [...this.$state.items];
    const index = items.findIndex(v => v.seq === seq);
    items[index].active = !items[index].active;
    this.setState({ items });
  }

}
