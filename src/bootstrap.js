/** @format */

import * as udviz from 'ud-viz';
import { MultiMediaVisualizer } from './Multimedia/MultiMediaVisualizer';
import { MultiMediaObject } from './Multimedia/MultiMediaObject';
import {LayerChoiceIfcExtension} from './Ifc/LayerChoiceExtension';
import { IfcAttributeModule } from './Ifc/IfcAttribute/IfcAttributeModule';

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


    ///// MULTIMEDIA MODULE
    let multimedia1 = new MultiMediaObject(configMultimedia['multimedia-data']['content-1'], false);
    let listMultimedia = [];
    let multimediaObjectList = []
    listMultimedia.push(multimedia1);
    const multimediaVisu = new MultiMediaVisualizer('content 1', app.view3D, listMultimedia);
    multimediaVisu.constructAllContent(true);
    Array.prototype.push.apply(multimediaObjectList, multimediaVisu.pictureObjects);
    multimediaVisu.constructHtml();
      
    app.view3D.html().addEventListener( 'click', onDocumentMouseClick );

       //Event to display multimedia content
    function onDocumentMouseClick( event ) {    
      event.preventDefault(); 

      let raycaster =  new udviz.THREE.Raycaster();
      let mouse3D = new udviz.THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
        -( event.clientY / window.innerHeight ) * 2 + 1,  
        0.5 );                                        
      raycaster.setFromCamera( mouse3D, app.view3D.getCamera() );
     
      let intersects = raycaster.intersectObjects( multimediaObjectList );

      if ( intersects.length > 0 ){
        intersects.forEach(elementIntersect => {
          //check visibility to not intersect with hidden object
          if(elementIntersect.object.visible == true){
            let multimediaObject = elementIntersect.object.userData.multimediaObject;
            document.getElementById('resumeVideo').textContent = multimediaObject.text;
            document.getElementById('episodeWindowVideo').hidden = false;
            document.getElementById('episodeWindowVideo').style.display = 'block';

            // Check if the multimedia is a video or not and change integration
            if (multimediaObject.isVideo){             
              document.getElementById('video-content').hidden = false;
              document.getElementById('video-content').src = multimediaObject.imgContent;
              
            }else{
              document.getElementById('video-content').hidden = true;
              document.getElementById('img-content').src = multimediaObject.imgContent;
            }
            //Change color when the multimedia is consume 
            elementIntersect.object.material.color.setRGB(0.3, 0.3, 0.3);
          }
        });
      }
    }

  });
});
