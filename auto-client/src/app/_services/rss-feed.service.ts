import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class RssFeedService {
 

  constructor(private http: HttpClient) {
  
   }
   getFeed(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(response => {
        let rssData: any;
        xml2js.parseString(response, { trim: true }, (err, result) => {

          if (!err) {
            rssData = result;
          }
        });
        return rssData;
      })
    );
  }
}
