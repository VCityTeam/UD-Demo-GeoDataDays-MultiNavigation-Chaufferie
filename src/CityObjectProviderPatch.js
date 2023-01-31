import { CityObjectProvider } from 'ud-viz/src/Widgets/CityObjects/ViewModel/CityObjectProvider';

export class CityObjectProviderPatch extends CityObjectProvider {

  constructor(layerManager) {
    super(layerManager);
  }

  /**
   * Select a city object based on a corresponding key,value pair in the batch table.
   *
   * @param {string} key the batch table key to search by.
   * @param {string} value the batch table value to search for.
   */
  selectCityObjectByBatchTable(key, value) {
    const cityObject = this.pickCityObjectByBatchTable(key, value);
    if (cityObject) {
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
    }
  }

  /**
  * Returns the first city object which corresponds to a key,value pair in a tilesManager's
  * batch table.
  *
  * @param {string} batchTableKey The batch table key to search by.
  * @param {string} batchTableValue The batch table value to search for.
  * @returns {CityObject | undefined}
  */
  pickCityObjectByBatchTable(batchTableKey, batchTableValue) {
    for (const tilesManager of this.layerManager.tilesManagers) {
      if (!tilesManager.tiles) {
        continue;
      }
      for (const tile of tilesManager.tiles) {
        if (
          !tile ||
          !tile.cityObjects ||
          !tile.batchTable ||
          !tile.batchTable.content[batchTableKey] ||
          !tile.batchTable.content[batchTableKey].includes(batchTableValue)
        ) {
          continue;
        }
        return tile.cityObjects[
          tile.batchTable.content[batchTableKey].indexOf(batchTableValue)
        ];
      }
    }
    console.warn(
      'WARNING: cityObject not found with key, value pair: ' +
        batchTableKey +
        ', ' +
        batchTableValue
    );
    return undefined;
  }
}