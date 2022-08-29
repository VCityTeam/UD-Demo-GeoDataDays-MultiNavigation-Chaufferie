/** @format */

import * as udviz from 'ud-viz';
import { MultiMediaVisualizer } from './MultiMediaVisualizer';
import { MultiMediaObject } from './MultiMediaObject';

const app = new udviz.Templates.AllWidget();

app.start('../assets/config/config.json').then((config) => {
  

  udviz.Components.SystemUtils.File.loadJSON(
    '../assets/config/configMultimedia.json'
  ).then(function (configMultimedia){
    let multimedia1 = new MultiMediaObject(configMultimedia['multimedia-data']['content-1'], false);
    const multimediaVisu = new MultiMediaVisualizer('content 1', app.view, multimedia1);
    console.log(app.view3D);
    multimediaVisu.constructAllContent(true);
    
    ////// REQUEST SERVICE
    const requestService = new udviz.Components.RequestService();

    ////// ABOUT MODULE
    const about = new udviz.Widgets.AboutWindow();
    app.addModuleView('about', about);

    ////// HELP MODULE
    const help = new udviz.Widgets.Extensions.HelpWindow(config.helpWindow);
    app.addModuleView('help', help);

    ////// AUTHENTICATION MODULE
    const authenticationService =
      new udviz.Widgets.Extensions.AuthenticationService(
        requestService,
        app.config
      );

    const authenticationView = new udviz.Widgets.Extensions.AuthenticationView(
      authenticationService
    );
    app.addModuleView('authentication', authenticationView, {
      type: udviz.Templates.AllWidget.AUTHENTICATION_MODULE,
    });

    ////// DOCUMENTS MODULE
    let documentModule = new udviz.Widgets.DocumentModule(
      requestService,
      app.config
    );
    app.addModuleView('documents', documentModule.view);

    ////// DOCUMENTS VISUALIZER EXTENSION (to orient the document)
    const imageOrienter = new udviz.Widgets.DocumentVisualizerWindow(
      documentModule,
      app.view,
      app.controls
    );

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
  const layerChoice = new udviz.Widgets.LayerChoice(app.layerManager);
  app.addModuleView('layerChoice', layerChoice);

  const inputManager = new udviz.Components.InputManager();
  ///// SLIDESHOW MODULE
  const slideShow = new udviz.Widgets.SlideShow(app, inputManager);
  app.addModuleView('slideShow', slideShow);
});
