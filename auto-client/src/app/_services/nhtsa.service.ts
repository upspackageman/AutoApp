import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehicleByYear } from '../_models/vehicleByYear';
import {  map, Observable, of, throwError } from 'rxjs';
import { VehicleModel } from '../_models/vehicleModel';
import { VehicleCrashRatingId } from '../_models/vehicleCrashRatingId';
import { Recall } from '../_models/recall';
import { Complaint } from '../_models/complaint';
import { CarInspectionZip } from '../_models/carInspectionZip';
import { CarInspectionState } from '../_models/carInspectionState';
import { VehicleCrashRating } from '../_models/vehicleCrashRating';
import { Investigation } from '../_models/investigation';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NhtsaService {

  baseUrl = 'http://192.168.0.28:8000/AutoApp/API/Controllers/NhtsaController.php';

  vidCache = new Map();
  pdfCache= new Map();
  nhtsaCache = new Map();
  recallCache = new Map();
  complaintCache = new Map();
 

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { }

  async getPdfData(url:any): Promise<Observable<any>>{

   
    var key = url;
    var response = this.pdfCache.get(key);
    if (response!==undefined) {
 
      return of(response)
    }
    return this.http.get<Blob>(this.baseUrl + '/getPdfFile/?link=' + url, { responseType: 'blob' as 'json' })
    .pipe(
      map((blob: Blob) => {
        // Create an Object URL from the Blob
        this.pdfCache.set(key,this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob)));
        const objectUrl = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl); // Return the Object URL
      })
    );
  }

  async getVideoPlayback(image:string): Promise<Observable<any>>{
    var key = image;

    var response = this.vidCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<Blob>(this.baseUrl + '/videoPlayback/?image=' + image, { responseType: 'blob' as 'json' })
    .pipe(
      map((blob: Blob) => {
        // Create an Object URL from the Blob
          console.log(blob.type);
         if( blob.type!=='video/mp4'){
          return 'DENIED'
         }
         this.vidCache.set(key,URL.createObjectURL(blob));
        const objectUrl = URL.createObjectURL(blob);
        return objectUrl; // Return the Object URL
      })
    );
  }
  
  async getVehicleInvestigation(start:any, end:any, offset:any): Promise<Observable<Investigation>>{
   
   
    return await this.http.get<Investigation>(this.baseUrl+'/getVehicleInvestigation?start='+start+'&end='+end+'&offset='+offset);
  }

  getVehicleByYear(year: any): Observable<VehicleByYear> {
    var key = year;
    var response = this.nhtsaCache.get(key);
    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<VehicleByYear>(this.baseUrl+'/getVehicleByYear?modelYear='+year)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);
      return response;
    }))
  }

  getVehicleModel(year:any, make:any){
    var key =`${year}-${make}`;

    var response = this.nhtsaCache.get(key);
    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<VehicleModel>(this.baseUrl+'/getVehicleModel?year='+year+'&make='+make)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);
      return response;
    }))
  }

  getVehicleCrashRatingId(year:any,make:any,model:any){

    var key =`${year}-${make}-${model}`;

    var response = this.nhtsaCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<VehicleCrashRatingId>(this.baseUrl+'/getVehicleCrashRatingId?year='+year+'&make='+make+'&model='+model)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);

      return response;
    }));
  }

  getRecalls(year:any,make:any,model:any){
    var key =`${year}-${make}-${model}`;

    var response = this.recallCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<Recall>(this.baseUrl+'/getRecalls?year='+year+'&make='+make+'&model='+model)
    .pipe(map(response=>{
      this.recallCache.set(key,response);

      return response;
    }));
  }

  getComplaints(year:any,make:any,model:any){
    var key =`${year}-${make}-${model}`;

    var response = this.complaintCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<Complaint>(this.baseUrl+'/getComplaints?year='+year+'&make='+make+'&model='+model)
    .pipe(map(response=>{
      this.complaintCache.set(key,response);

      return response;
    }));
  }

  carSeatInspectionLocatorByZip(zip:any){
    var key =zip;

    var response = this.nhtsaCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }

    return this.http.get<CarInspectionZip>(this.baseUrl+'/carSeatInspectionLocatorByZip?zip='+zip)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);

      return response;
    }));
  }

  carSeatInspectionLocatorByState(state:any){
    var key =state;

    var response = this.nhtsaCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }
    return this.http.get<CarInspectionState>(this.baseUrl+'/carSeatInspectionLocatorByState?state='+state)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);

      return response;
    }));
  }

  getVehicleCrashRating(id:any){
    var key =id;

    var response = this.nhtsaCache.get(key);

    if (response!==undefined) {
 
      return of(response)
    }
    return this.http.get<VehicleCrashRating>(this.baseUrl+'/getVehicleCrashRating/?id='+id)
    .pipe(map(response=>{
      this.nhtsaCache.set(key,response);
      return response;
    }));
  }
}


