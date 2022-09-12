import { CityObjectProvider } from 'ud-viz/src/Widgets/CityObjects/ViewModel/CityObjectProvider';

export class CityObjectProviderPatch extends CityObjectProvider {

  constructor(layerManager) {
    super(layerManager);
  }

  selectCityObjectByBatchTable(key, value) {
    let tileManagerAndCityObject = this.pickCityObjectByBatchTablePatch(key, value);
    // let cityObject = this.layerManager.pickCityObjectByBatchTable(key, value)[1];
    if (tileManagerAndCityObject && tileManagerAndCityObject[1]) {
      let cityObject = tileManagerAndCityObject[1]
      if (this.selectedCityObject != cityObject) {
        if (this.selectedCityObject) {
          this.sendEvent(
            CityObjectProvider.EVENT_CITY_OBJECT_CHANGED,
            cityObject
          );
          this.unselectCityObject();
        } else {
          this.sendEvent(
            CityObjectProvider.EVENT_CITY_OBJECT_SELECTED,
            cityObject
          );
        }
        this.selectedCityObject = cityObject;
        this.selectedTilesManager = this.layerManager.getTilesManagerByLayerID(
          this.selectedCityObject.tile.layer.id
        );
        this.selectedStyle =
          this.selectedTilesManager.styleManager.getStyleIdentifierAppliedTo(
            this.selectedCityObject.cityObjectId
          );
        this.selectedTilesManager.setStyle(
          this.selectedCityObject.cityObjectId,
          'selected'
        );
        this.selectedTilesManager.applyStyles({
          updateFunction: this.selectedTilesManager.view.notifyChange.bind(
            this.selectedTilesManager.view
          ),
        });
        this.removeLayer();
      }
    } else {
      console.warn('WARNING: cityObject not found with key, value pair: ' + key + ', ' + value);
    }
  }

  pickCityObjectByBatchTablePatch(batchTableKey, batchTableValue) {
    for (let tilesManager of this.layerManager.tilesManagers) {
      if (tilesManager.tiles){
        for (let tile of tilesManager.tiles) {
          if (tile){
            if (tile.cityObjects && tile.batchTable) {
              if (tile.batchTable.content[batchTableKey]) {
                if (tile.batchTable.content[batchTableKey].includes(batchTableValue)){
                  return [tilesManager,tile.cityObjects[tile.batchTable.content[batchTableKey].indexOf(batchTableValue)]];
                }
              }
            }
          }
        }
      }
    }
    return undefined;
  }
}