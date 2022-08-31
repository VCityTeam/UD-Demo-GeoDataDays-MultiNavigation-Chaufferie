import { Widgets } from 'ud-viz';
import { setIfcStyles } from './Utils';
export class LayerChoiceIfcExtension extends Widgets.Components.ModuleView {
  constructor(layerChoiceModule, config) {
    super();

    this.layerChoiceModule = layerChoiceModule;
    for (let layer of config['3DTilesLayers']) {
      if (layer['ifc']) {
        setIfcStyles(this.layerChoiceModule.layerManager, layer['id']);
      }
    }

    this.addZoomOnTileset();

    this.displayIfcTiles();
  }

  addZoomOnTileset() {}

  displayIfcTiles() {
    if (this.layerChoiceModule) {
      this.layerChoiceModule.addEventListener(
        Widgets.Components.GUI.Window.EVENT_CREATED,
        () => {

          this.layerChoiceModule.elevationLayersBoxSectionElement.remove();
          this.layerChoiceModule.colorLayersBoxSectionElement.remove();

          document.getElementsByClassName("window")[0].style.maxHeight="60%";
          document.getElementsByClassName("window")[0].style.overflow="auto";

          let layers = this.layerChoiceModule.layerManager.getGeometryLayers();

          for (let i = 0; i < layers.length; i++) {
            let tilesManager =
              this.layerChoiceModule.layerManager.getTilesManagerByLayerID(
                layers[i].id
              );
            let tiles = undefined;
            let htmlTiles = document.getElementById('div' + layers[i].id);
            let item = document.createElement('span');

            let itemInput = document.createElement('input');
            itemInput.type = 'checkbox';
            itemInput.className = 'spoiler-check';
            itemInput.id = layers[i].id + '-spoiler';

            let itemLabel = document.createElement('label');
            itemLabel.htmlFor = layers[i].id + '-spoiler';
            itemLabel.className = 'subsection-title';

            let itemDivSpoiler = document.createElement('div');
            itemDivSpoiler.className = 'spoiler-box';

            if (tilesManager !== undefined) {
              if (tilesManager.layer.isIfcLayer) {
                tiles = tilesManager.getTilesWithGeom();
                for (let j = 0; j < tiles.length; j++) {
                  let new_tile = null;
                  if (tiles[j].asAttributeInBatchTable('classe')) {
                    new_tile =
                      tiles[j].batchTable.content.classe[
                        tiles[j].cityObjects[0].batchId
                      ];
                  } else if (tiles[j].asAttributeInBatchTable('group')) {
                    new_tile =
                      tiles[j].batchTable.content.group[
                        tiles[j].cityObjects[0].batchId
                      ];
                  }
                  if (new_tile) {
                    itemDivSpoiler.innerHTML += `<p><input type="checkbox" id="checkbox_${
                      layers[i].id
                    }_${j}" ${
                      tiles[j].getMeshes()[0].visible ? 'checked' : ''
                    }>${new_tile}</input></p>`;
                  }
                  itemDivSpoiler.oninput = (event) => {
                    if (
                      event.srcElement.id.includes(
                        'checkbox_' + layers[i].id + '_'
                      )
                    ) {
                      let tileIndex = event.srcElement.id.split('_'); //.slice(-1)[0];
                      tileIndex = tileIndex[tileIndex.length - 1];
                      tiles[tileIndex].getMeshes()[0].visible =
                        event.srcElement.checked;
                      this.layerChoiceModule.layerManager.notifyChange();
                    }
                  };
                }
                item.appendChild(itemInput);
                item.appendChild(itemLabel);
                item.appendChild(itemDivSpoiler);
                htmlTiles.appendChild(item);
              }
            }
          }
        }
      );
    }
  }
}
