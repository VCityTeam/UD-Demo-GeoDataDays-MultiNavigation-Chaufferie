import * as THREE from 'three';

/**
 * Class to create a content of an epidose
 * 
 */
export class MultiMediaObject { 
  /**
     * Create a content
     * 
     * @param {JSON} dataContent data correspond to the content number n of your episode
     */
  constructor(dataContent, isVideo){
    this.isVideo = isVideo;
    this.lock = true;
    this.imgContent = null;
    this.imgThumbnail = null;
    this.position = this.ParsePositionContent(dataContent['position']);
    this.text = dataContent['text'];
    this.src = dataContent['src'];
    this.ParseImgContent(dataContent);
  }

  /**
     * Method to parse position of a content 
     * @param {JSON} positionData 
     * @returns return a Vector3 correspond to the position of your content in the itowns scene 
     */
  ParsePositionContent(positionData){
    let x = parseInt(positionData['x']);
    let y = parseInt(positionData['y']);
    let z = parseInt(positionData['z']);

    return new THREE.Vector3(x,y,z);
  }

  /**
     * Method to parse the path of your images lock and unlock of a content
     * @param {JSON} imgData 
     */
  ParseImgContent(imgData){
    this.imgThumbnail = imgData['imgThumbnail'];
    this.imgContent = imgData['imgContent'];
  }
}