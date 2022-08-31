import { Widgets } from 'ud-viz';
import { IfcAttributeWindow } from './IfcAttributeWindow';

export class IfcAttributeModule extends Widgets.Components.ModuleView {
  constructor(cityObjectModule) {
    super();
    this.ifcAttributeWindow;
    if(cityObjectModule){
      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_SELECTED', (cityObject) => {
        if(!cityObjectModule.isExtensionUsed('ifc_attribute') && (cityObject.tile.layer.isIfcLayer))  
          this.createExtension(cityObjectModule,cityObject);       
          this.actualCityObject = cityObject;
      });

      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_CHANGED', (cityObject) => {
        if(cityObject.tile.layer.isIfcLayer) {
          if (this.ifcAttributeWindow) 
            this.ifcAttributeWindow.update(cityObject);
            this.actualCityObject = cityObject;
        }
        else this.deleteExtension(cityObjectModule);
      });

      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_UNSELECTED', () => {
        this.deleteExtension(cityObjectModule);
      });
    }
  }

  createExtension(cityObjectModule,cityObject){

    if(cityObject.tile.layer.isIfcLayer) {
      cityObjectModule.addExtension('ifc_attribute',{
        type: 'button',
        html: 'IFC info',
        callback: () => {
          this.ifcAttributeWindow = new IfcAttributeWindow(cityObject,cityObjectModule.view.parentElement);
        }
      });
    }
  }

  deleteExtension(cityObjectModule){
    if(cityObjectModule.isExtensionUsed('ifc_attribute')) {  
      cityObjectModule.removeExtension('ifc_attribute');
      if(this.ifcAttributeWindow){
        this.ifcAttributeWindow.dispose();
        this.ifcAttributeWindow = null;  
      }                      
    }
  }

}