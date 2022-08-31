import { Widgets } from 'ud-viz';


export class IfcAttributeWindow extends Widgets.Components.GUI.Window {
  constructor(cityObject,htmlElement) {
    super('ifcAttribute', 'ifc Attribute', false);

    this.cityObject;

    this.ifcId;

    this.appendTo(htmlElement);

    this.update(cityObject);

  }

  get innerContentHtml() {
    return /*html*/`
        <div id="${this.ifcDivID}">
        </div>
        `;
  }

  update(cityObject) {
    if(cityObject){
      while (this.ifcDivElement.hasChildNodes()) {
        this.ifcDivElement.removeChild(this.ifcDivElement.firstChild);
      }
      this.cityObject = cityObject;
      this.addAttribute('id');
      this.addAttribute('classe');
      this.addAttribute('name');
      this.addPSET();
    }
  }

  addAttribute(attributeName){
    if(this.cityObject.props[attributeName])
    {
      let new_div = document.createElement('div');
      new_div.id = attributeName;
      new_div.innerText = attributeName + ' : ' + this.cityObject.props[attributeName];
      this.ifcDivElement.appendChild(new_div);
    }
  }

  addPSET(){
    if(this.cityObject.props['properties']){
      for(let prop of this.cityObject.props['properties']){
        let new_div = document.createElement('div');
        new_div.innerText = prop[0];
        let list = document.createElement('ul');
        for(var i = 1; i < prop.length;i++){
          let el = document.createElement('li');
          el.innerText = prop[i][0] + ' : ' + prop[i][1].toString();
          list.appendChild(el);
        }
        new_div.appendChild(list);
        this.ifcDivElement.appendChild(new_div);
      }
    }
  }

  windowCreated() {
  }

  get ifcAttributeID() {
    return 'ifc_attribute';
  }

  get ifcAttributeElement() {
    return document.getElementById(this.ifcAttributeID);
  }

  get ifcDivID() {
    return 'ifc_attribute_div';
  }

  get ifcDivElement() {
    return document.getElementById(this.ifcDivID);
  }

}
