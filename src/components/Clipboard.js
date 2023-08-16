import Component from "../core/Component.js";

export default class Clipboard extends Component {

  template() {
    const { filteredItems } = this.$props;
const groupedItems = filteredItems.reduce((acc, { id, type, value, datetime }) => {
  const date = datetime.split('T')[0]; // 날짜 부분만 추출
  const lastIndex = acc.length - 1;

  if (lastIndex >= 0 && acc[lastIndex].date === date) {
    // 같은 날짜에 속하는 데이터인 경우 리스트에 추가
    acc[lastIndex].items.push({ id, type, value });
  } else {
    // 새로운 날짜에 속하는 데이터인 경우 새로운 리스트 아이템 생성
    acc.push({ date, items: [{ id, type, value }] });
  }

  return acc;
}, []);
console.log(filteredItems)
    return `
    <div>clipboard~~</div>
<button class="pre-clicked">pre</button>
<button class="next-clicked">next</button>

  ${groupedItems.map(({ date, items }) => `
    <div>
      - ${date}
      ${items.map(({ id, type, value }) => `
        <ul>
          <li class="listClick" id="${id}">
            ${type === 0 ? value : `<img src="${value}">`}
          </li>
        </ul>
      `).join('')}
    </div>
  `).join('')}

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
          window.api.send("click-clipboard", {type:0, data:target.innerHTML.trim()});
          break;
        case "IMG":
          window.api.send("click-clipboard", {type:1, data:target.src});          
          break
      }
    })
  }
}
