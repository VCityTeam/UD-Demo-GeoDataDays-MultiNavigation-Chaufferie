/** @format */

import * as udviz from 'ud-viz';
import { MultiMediaVisualizer } from './Multimedia/MultiMediaVisualizer';
import { MultiMediaObject } from './Multimedia/MultiMediaObject';
import {LayerChoiceIfcExtension} from './Ifc/LayerChoiceExtension';
import { IfcAttributeModule } from './Ifc/IfcAttribute/IfcAttributeModule';
import { SparqlModule } from './SPARQL/SparqlModule';

const app = new udviz.Templates.AllWidget();

app.start('../assets/config/config.json').then((config) => {


  udviz.Components.SystemUtils.File.loadJSON(
    '../assets/config/configMultimedia.json'
  ).then(function (configMultimedia){

    ////// REQUEST SERVICE
    const requestService = new udviz.Components.RequestService();

    ////// ABOUT MODULE
    const about = new udviz.Widgets.AboutWindow();
    app.addModuleView('about', about);

    ////// HELP MODULE
    const help = new udviz.Widgets.Extensions.HelpWindow(config.helpWindow);
    app.addModuleView('help', help);

    ////// CITY OBJECTS MODULE
    let cityObjectModule = new udviz.Widgets.CityObjectModule(
      app.view3D.layerManager,
      app.config
    );
    app.addModuleView('cityObjects', cityObjectModule.view);

    ////// 3DTILES DEBUG
    const debug3dTilesWindow = new udviz.Widgets.Debug3DTilesWindow(
      app.view3D.layerManager
    );
    app.addModuleView('3dtilesDebug', debug3dTilesWindow, {
      name: '3DTiles Debug',
    });

    ////// CAMERA POSITIONER
    const cameraPosition = new udviz.Widgets.CameraPositionerView(
      app.view3D.getItownsView()
    );
    app.addModuleView('cameraPositioner', cameraPosition);

    ////// LAYER CHOICE MODULE
    const layerChoice = new udviz.Widgets.LayerChoice(app.view3D.layerManager);
    app.addModuleView('layerChoice', layerChoice);

    ////// IFC EXTENSION OF LAYER CHOICE MODULE
    const layerChoiceIfcExtension = new LayerChoiceIfcExtension(layerChoice,app.config);

    ///// IFC EXTENSION OF CITYOBJECT MODULE
    const ifcAttributeModule = new IfcAttributeModule(cityObjectModule);

    const inputManager = new udviz.Components.InputManager();
    ///// SLIDESHOW MODULE
    const slideShow = new udviz.Widgets.SlideShow(app, inputManager);
    app.addModuleView('slideShow', slideShow);

    ////// TEMPORAL MODULE
    const temporalModule = new udviz.Widgets.TemporalModule(
      app.view3D.getLayerManager().tilesManagers[0],
      app.config.temporalModule
    );
    app.addModuleView('temporal', temporalModule.view);


    ///// MULTIMEDIA MODULE
    let photosJson = configMultimedia['multimedia-data']['photos'];
    let listMultimedia = [];
    let multimediaObjectList = [];

    // //Create all Multimedia object
    // for (let photo of photosJson){
    //   let multimedia = new MultiMediaObject(photo, false);
    //   listMultimedia.push(multimedia);
    // }
    
    // const multimediaVisu = new MultiMediaVisualizer('photo', app.view3D, listMultimedia);
    // multimediaVisu.constructAllContent(true);
    // Array.prototype.push.apply(multimediaObjectList, multimediaVisu.pictureObjects);
    // multimediaVisu.constructHtml();

    // //Set event for interactive object
    // app.view3D.html().addEventListener( 'click', onDocumentMouseClick );

    // function onDocumentMouseClick(event){
    //   event.preventDefault();
    //   let raycaster =  new udviz.THREE.Raycaster();
    //   let mouse3D = new udviz.THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
    //     -( event.clientY / window.innerHeight ) * 2 + 1,  
    //     0.5 );                                       
    //   raycaster.setFromCamera( mouse3D, app.view3D.getCamera() );
    //   multimediaVisu.selectMultimediaObject(raycaster);
    // }
    
    ////// SPARQL MODULE
    const sparqlModule = new SparqlModule(
      app.config,
      app.view3D.getLayerManager()
    );
    app.addModuleView('sparqlModule', sparqlModule.view, {
      name: 'Data Explorer',
    });

  });
});
