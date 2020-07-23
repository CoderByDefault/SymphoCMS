import { Component, OnInit } from '@angular/core';
import { Sympholights } from '../models/Sympholights';
import { MediaLibrary } from '../models/MediaLibrary';
import { UsedEffects } from '../models/UsedEffects';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SympholightsService } from '../services/sympholights.service';
//import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { element } from 'protractor';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {


  urls = new Array<string>();
  newurls = new Array<string>();
  fileDetails = new Array<string>();
  public fileName;
  

  detectFiles(event) {
    this.urls = [];
    this.fileDetails = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
          //console.log(file);
          this.fileDetails.push(file);
        }
        reader.readAsDataURL(file);
      }
      this.fileName = event.target.files[0].name;
      console.log(this.fileDetails)
      for (var i = 0; i < event.target.files.length; i++) {

        var type = event.target.files[i].type;
        var size = event.target.files[i].size;
        var modifiedDate = event.target.files[i].lastModifiedDate;

        /*console.log ('Name: ' + name + "\n" + 
          'Type: ' + type + "\n" +
          'Last-Modified-Date: ' + modifiedDate + "\n" +
          'Size: ' + Math.round(size / 1024) + " KB");*/
      }
    }
    /*for (var i = 0; i < event.target.files.length; i++) { 
      var name = event.target.files[i].name;
      var type = event.target.files[i].type;
      var size = event.target.files[i].size;
      var modifiedDate = event.target.files[i].lastModifiedDate;
      
      console.log ('Name: ' + name + "\n" + 
        'Type: ' + type + "\n" +
        'Last-Modified-Date: ' + modifiedDate + "\n" +
        'Size: ' + Math.round(size / 1024) + " KB");
    }*/
  }
  public sympholights: Sympholights[] = [];
  public medialibrary: MediaLibrary[] = [];
  public medialibrary2: MediaLibrary[] = [];
  public usedeffects: UsedEffects[] = [];

  mediaItems = new Array<object>();
  mediaItems2 = new Array<object>();
  token: string;
  srcData: SafeResourceUrl;
  constructor(private httpClient: HttpClient, private _sympholightService: SympholightsService/*, private authservice: AuthService*/, private sanitizer: DomSanitizer) { }

  getSantizeUrl(url: string) {
    this.srcData = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return this.srcData;

  }
  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer !== event.container) {

      copyArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex)
    } else {
      moveItemInArray(this.newurls, event.previousIndex, event.currentIndex);
    }
    console.log(this.newurls);
  }


  loadLocations() {
    this._sympholightService.getLocations()
      .subscribe((sympholights: Sympholights[]) => {
        this.sympholights = sympholights;

        sympholights.forEach(element => {
          //console.log(element.ipAddress)
          this.loadMediaLibrary(element.ipAddress);
          this.loadUsedEffects(element.ipAddress);
          // this.loadSequences(element.ipAddress);
        });

      });
  }
  loadMediaLibrary(ip: string) {
    this.token = localStorage.getItem("authToken");
    this._sympholightService.getMediaLibrary(this.token, ip)
      .subscribe((medialibrary: MediaLibrary[]) => {
        this.medialibrary = medialibrary;


        medialibrary.forEach(element => {
          this.mediaItems.push(element.children);
            
            
          
          //console.log('data  ' + element.children[length].thumbnailPath);
        }

        )

        //console.log(this.mediaItems)
        this.mediaItems.forEach(elementIn => {

          for (let index = 0; index < this.mediaItems.length; index++) {
            //console.log(elementIn[index])

            this.mediaItems2.push(elementIn[index])
            
          }

          
          //console.log(elementIn[length].displayName)

          if(elementIn[length].category === "Image"){
            //console.log(elementIn[length].displayName)
          }
          else if(elementIn[length].category === "Video"){
            //console.log(elementIn[length].displayName)
          }
        });
        //console.log('data  ' + this.medialibrary);
      });

      console.log(this.mediaItems2)
  }

  loadUsedEffects(ip: string) {
    this.token = localStorage.getItem("authToken");
    this._sympholightService.getUsedEffects(this.token, ip)
      .subscribe((usedeffects: UsedEffects[]) => {
        this.usedeffects = usedeffects;


        usedeffects.forEach(element => {
          //console.log('data  ' + element.name);
          
        }

        )
        //console.log('data  ' + this.usedeffects);
      });

  }

  login() {
    this._sympholightService.getAuthenticated("admin", "ecue")
      .pipe(first())
      .subscribe(
        data => {
          this.token = data.token
          localStorage.setItem("authToken", this.token)
        });
  }

  uploadFile() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
    }

    var name = this.fileName;
    var sourceFilename = this.fileName;
    var mediaLibraryFolder = '';
    var width = '1280';
    var height = '720';
    var bitRate = '0';

    this.httpClient.post('https://127.0.0.1:5001/api/medialibrary/video/import', { name, sourceFilename, mediaLibraryFolder, width, height, bitRate }, header).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )


  }
  
  applyChanges() {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + this.token)
    }

    this.httpClient.post('https://127.0.0.1:5001/api/contentmanagement/effects/apply', header).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )

    //alert("changes applied")

  }

  ngOnInit(): void {
    this.login();
    this.loadLocations();
    this.newurls = [];
    //console.log(this.newurls);



  }

}
