import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SympholightsService {

  constructor(private httpClient: HttpClient) { }

  getLocations() {
    return this.httpClient.get("../assets/config.json");
  }

  /* Method to automatically authenticate users with already set Username and Password */
  getAuthenticated(username: string, password: string) {
    return this.httpClient.post<any>('https://127.0.0.1:5001/api/auth/login', { username, password })
      .pipe(map(user => {
        return user;
      }));
  }
   /* Method to GET all the controllers */  
  getMediaLibrary(token: string, ipAddress: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + token)
    }
    return this.httpClient.get("https://" + ipAddress + ":5001/api" + "/medialibrary", header);
  }

  getUsedEffects(token: string, ipAddress: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + token)
    }
    return this.httpClient.get("https://" + ipAddress + ":5001/api" + "/contentmanagement/effects/video", header);
  }
   /* Method to GET all the sequences */  
  getSequences(token: string, ipAddress: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + token)
    }
    return this.httpClient.get("https://" + ipAddress + ":5001/api" + "/sequences", header);
  }

  /*update(token: string, ipAddress: string) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + token)
    }
    return this.httpClient.put(this.ipAddress + '/products/' + id, JSON.stringify(product), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }*/

}
