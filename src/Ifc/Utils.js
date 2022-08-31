/** @format */

import { TilesManager } from 'ud-viz/src/Components/Components';

export function registerIfcStyle(tilesmanager) {
  tilesmanager.registerStyle('Wall', {
    materialProps: { opacity: 1, color: 0xfcf8c9 },
  });
  tilesmanager.registerStyle('Window', {
    materialProps: { opacity: 0.6, color: 0x36b9d6 },
  });
  tilesmanager.registerStyle('Pipe', {
    materialProps: { opacity: 1, color: 0xff7f50 },
  });
  tilesmanager.registerStyle('Duct', {
    materialProps: { opacity: 1, color: 0xadd8e6 },
  });
}

export function getIfcStyleByClass(ifcClass) {
  if (ifcClass.includes('Pipe')) {
    return 'Pipe';
  }
  if (ifcClass.includes('Duct')) {
    return 'Duct';
  }
  if (
    ifcClass == 'IfcWall' ||
    ifcClass.includes('Stair') ||
    ifcClass == 'IfcSlab'
  ) {
    return 'Wall';
  }
  if (ifcClass == 'IfcWindow') {
    return 'Window';
  }
  return undefined;
}

export function setIfcStyles(layerManager, layerIFC) {  
  if (layerManager.getTilesManagerByLayerID(layerIFC) != undefined) {
    let tilesmanager = layerManager.getTilesManagerByLayerID(layerIFC);
    tilesmanager.layer.isIfcLayer = true;
    registerIfcStyle(tilesmanager);
    tilesmanager.addEventListener(
      TilesManager.EVENT_TILE_LOADED,
      function () {
        for (let j = 0; j < tilesmanager.tiles.length; j++) {
          if (tilesmanager.tiles[j] != undefined) {
            if (tilesmanager.tiles[j].cityObjects != undefined) {
              for (
                let k = 0;
                k < tilesmanager.tiles[j].cityObjects.length;
                k++
              ) {
                let style = getIfcStyleByClass(
                  getIfcClasse(tilesmanager.tiles[j].cityObjects[k])
                );
                if (style != undefined) {
                  tilesmanager.setStyle(
                    tilesmanager.tiles[j].cityObjects[k].cityObjectId,
                    style
                  );
                }
              }
              tilesmanager.applyStyleToTile(tilesmanager.tiles[j].tileId, {
                updateFunction: tilesmanager.view.notifyChange.bind(
                  tilesmanager.view
                ),
              });
              tilesmanager.view.notifyChange();
            }
          }
        }
      }
    );
  }
}

export function getIfcClasse(cityObject) {
  return cityObject.tile.batchTable.content.classe[cityObject.batchId];
}
