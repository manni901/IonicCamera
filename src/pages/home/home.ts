import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {Camera} from "ionic-native";

declare var Clarifai : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
 
    public base64Image: string;
    public imageTags: string;
    public app: any;
 
    constructor(private navController: NavController) {
        this.base64Image = "https://placehold.it/150x150";
        this.imageTags = "";
        console.log("haha");
        this.app = new Clarifai.App(
          'OTGj6hMz_MJdIFld4q91EmNMuxqR_ttUq7FF83YI',
          '_yIdO28TNqonDVoz6jDJFcbrTQA9bSm-hSDbJNR_'
        );
        console.log(this.app);
        this.doStuff();
    }

    public doStuff() {
    }
 
    public takePicture() {
        var self = this;
        Camera.getPicture({
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        }).then(imageData => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
            this.app.models.predict(Clarifai.GENERAL_MODEL, imageData).then(
              function(response) {
                console.log(response);
                if(response.data.status.code == 10000){
                    response.data.outputs[0].data.concepts.forEach(function(concept) {
                        self.imageTags += concept.name + " : " + concept.value + "\n";
                    });
                    console.log(self.imageTags);
                }
              },
              function(err) {
                console.error(err);
              }
            );
        }, error => {
            console.log("ERROR -> " + JSON.stringify(error));
        });
    }
 
}
