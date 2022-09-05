import Component from "./core/Component.js";
import Items from "./components/Items.js";
import ItemAppender from "./components/ItemAppender.js";
import Header from "./components/Header.js";
import Setting from "./components/Setting.js"
export default class App extends Component {

  setup() {
    this.$state = {
      change_component: 0,
      items: [
        {
          seq: 1,
          contents: 'item1',
          active: false,
        },
        {
          seq: 2,
          contents: 'item2',
          active: true,
        }
      ]
    };
    
    
  }

  template() {
    return `
      <header data-component="header"></header>
      <main data-component="items" style="display: ${this.nowComponent===0 ? 'block' : 'none'}"></main>
      <main data-component="setting" style="display: ${this.nowComponent===0 ? 'none' : 'block'}"></main>
    `;
  }

  mounted() {
    window.api.receive("fromMain", (data) => {
      console.log(`Received [${data}] from main process`);
    });
    window.api.receive("close-clipboard", (data) => {
      console.log(`Received [${data}] from main process`);
    });
    window.api.receive("open-clipboard", (data) => {
      this.addItem(data)
      console.log(data)
    });
    const { filteredItems, addItem, deleteItem, toggleItem, changeComponent, nowComponent } = this;
    const $header = this.$target.querySelector('[data-component="header"]');
    const $items = this.$target.querySelector('[data-component="items"]');
    const $setting = this.$target.querySelector('[data-component="setting"]');
    
    new Items($items, {
      filteredItems,
      deleteItem: deleteItem.bind(this),
      toggleItem: toggleItem.bind(this),
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
    console.log(seq)
    const active = false;
    console.log(contents)
    this.setState({
      items: contents
    });
  }

  deleteItem(seq) {
    const items = [...this.$state.items];
    items.splice(items.findIndex(v => v.seq === seq), 1);
    this.setState({ items });
  }

  toggleItem(seq) {
    const items = [...this.$state.items];
    const index = items.findIndex(v => v.seq === seq);
    items[index].active = !items[index].active;
    this.setState({ items });
  }

}
